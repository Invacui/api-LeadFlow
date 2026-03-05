// Node.js built-in modules
import crypto from 'crypto';

// Data Access Object (DAO) for authentication-related database operations
import { authDao } from './Auth.dao';

// Helper functions for password hashing and comparison
import { hashPassword, comparePassword } from '@/shared/helpers/password.helper';

// Helper functions for token generation and verification
import { signAccess, signRefresh, verifyRefresh } from '@/shared/helpers/token.helper';

// Email sending utility
import { sendEmail } from '@/shared/lib/resend.lib';

// Global constants used across the application
import { globalConstants } from '@/constants/Global.constants';

// Data Transfer Objects (DTOs) for request and response types
import {
  SignupRequest, LoginRequest, AuthTokens, MeResponse,
  ForgotPasswordRequest, ResetPasswordRequest, ResendVerificationRequest,
} from './Auth.dto';

/**
 * AuthService
 * 
 * @description Service class for handling authentication-related business logic such as user signup, login, token refresh, logout, email verification, and password reset. Each method corresponds to a specific authentication action and interacts with the AuthDAO for database operations, as well as utilizing helper functions for tasks like password hashing and token management. The service ensures that appropriate errors are thrown for various failure scenarios, allowing the controller to handle response formatting accordingly.
 */
export class AuthService {

  /**
   * signup
   * 
   * @description Handles user registration by accepting email, password, and corporation name. Validates input, checks for existing email, creates new user, and sends verification email. Returns authentication tokens and user information on successful registration or throws appropriate errors for validation failures or if email is already registered.
   * 
   * @param {SignupRequest} data - Object containing user registration details such as email, password, name, and corporation name. This data is validated before processing the signup request. The method checks if the email is already registered, creates a new corporation and user record in the database, generates email verification tokens, and sends a verification email to the user. Finally, it returns authentication tokens and user information for the newly registered account.
   * @returns {Promise<{ tokens: AuthTokens; user: MeResponse }>} - A promise that resolves to an object containing the authentication tokens and user information for the newly registered account.
   */
  async signup(data: SignupRequest): Promise<{ tokens: AuthTokens; user: MeResponse }> {

    global.logger.info('Initiating signup [SERVICE]',
      {
        methodName: this.signup.name,
        fileName: __filename,
        email: data.email,
        corporationName: data.corporationName,
      }
    );

    // Check if email is already registered
    const existing = await authDao.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');

    // Create corporation
    const corp = await authDao.createCorporation(data.corporationName);
    
    // Hash password and create user
    const passwordHash = await hashPassword(data.password);
    
    // Generate email verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user record in the database
    const user = await authDao.create({
      email: data.email,
      name: data.name,
      passwordHash,
      corporationId: corp.id,
      emailVerifyToken: verifyToken,
      emailVerifyExpires: verifyExpires,
      tokenBalance: globalConstants.FREE_DEMO_TOKENS,
    });

    // Send verification email (fire and forget)
    sendEmail({
      to: user.email,
      subject: 'Verify your LeadFlow email',
      html: `<p>Click <a href="${process.env.BASE_URL}/api/v1/auth/verify-email/${verifyToken}">here</a> to verify your email.</p>`,
    }).catch(() => {});

    const tokens = this.generateTokens(user);
    await authDao.update(user.id, { refreshToken: tokens.refreshToken });

    return { tokens, user: this.toMeResponse(user) };
  }

  /**
   * login
   * 
   * @description Handles user login by accepting email and password. Validates input, checks for existing user, verifies password, generates authentication tokens, and returns them along with user information on successful login or throws appropriate errors for validation failures or if user is not found.
   * 
   * @param {LoginRequest} data - Object containing user login details such as email and password. This data is validated before processing the login request. The method checks if the user exists, verifies the password, generates authentication tokens, and updates the user's refresh token in the database. Finally, it returns the authentication tokens and user information for the logged-in account.
   * @returns {Promise<{ tokens: AuthTokens; user: MeResponse }>} - A promise that resolves to an object containing the authentication tokens and user information for the logged-in account.
   */
  async login(data: LoginRequest): Promise<{ tokens: AuthTokens; user: MeResponse }> {

    global.logger.info('Initiating login [SERVICE]',
      {
        methodName: this.login.name,
        fileName: __filename,
        email: data.email,
      }
    );

    // Find user by email
    const user = await authDao.findByEmail(data.email);
    
    // Validate user existence and status
    if (!user || user.isDeleted || user.isSuspended) throw new Error('Invalid credentials');
    
    // Validate password
    if (!user.passwordHash) throw new Error('Invalid credentials');

    // Compare provided password with stored hash
    const valid = await comparePassword(data.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    // Generate authentication tokens
    const tokens = this.generateTokens(user);

    // Update user's refresh token in the database
    await authDao.update(user.id, { refreshToken: tokens.refreshToken });

    return { tokens, user: this.toMeResponse(user) };
  }

  /**
   * refresh
   * 
   * @description Handles token refresh by accepting a refresh token. Validates input, checks for existing user, verifies refresh token, and returns new access token on successful refresh or throws appropriate errors for validation failures or if user is not found.
   * 
   * @param {string} refreshToken - The refresh token provided by the client for obtaining a new access token. This token is validated and verified against the stored refresh token in the database. If valid, a new access token is generated and returned to the client. If the token is invalid or if the associated user account is suspended or deleted, appropriate errors are thrown.
   * @returns {Promise<{ accessToken: string }>} - A promise that resolves to an object containing the new access token if the refresh operation is successful.
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    global.logger.info('Initiating token refresh [SERVICE]',
      {
        methodName: this.refresh.name,
        fileName: __filename,
        refreshToken,
      }
    );
    
    // Verify the refresh token and extract the payload
    const payload = verifyRefresh(refreshToken);

    // Find user by refresh token
    const user = await authDao.findByRefreshToken(refreshToken);
    
    // Validate user existence and status
    if (!user || user.id !== payload.id) throw new Error('Invalid refresh token');
    
    // Check if the user account is deleted or suspended
    if (user.isDeleted || user.isSuspended) throw new Error('Account suspended');

    // Generate new access token
    const accessToken = signAccess({ id: user.id, role: user.role, tokenBalance: user.tokenBalance });
    return { accessToken };
  }

  /**
   * logout
   * 
   * @description Handles user logout by invalidating the access token and refresh token. Returns success message on successful logout or throws appropriate errors if user is not found.
   * 
   * @param {string} userId - The ID of the user who is logging out. This method invalidates the user's refresh token in the database, effectively logging them out of the system. If the user is not found, an appropriate error is thrown.
   * @returns {Promise<void>} - A promise that resolves when the logout operation is complete.
   */
  async logout(userId: string): Promise<void> {
    global.logger.info('Initiating logout [SERVICE]',
      {
        methodName: this.logout.name,
        fileName: __filename,
        userId,
      }
    );
    
    await authDao.update(userId, { refreshToken: null });
  }

  /**
   * getMe
   * 
   * @description Retrieves the information of the currently authenticated user. Accepts the user ID, fetches the user details from the database, and returns them in a structured format. If the user is not found, an appropriate error is thrown.
   * 
   * @param {string} userId - The ID of the currently authenticated user. This method retrieves the user's information from the database and returns it in a structured format. If the user is not found, an appropriate error is thrown. 
   * @returns {Promise<MeResponse>} - A promise that resolves to the user's information.
   */
  async getMe(userId: string): Promise<MeResponse> {
    global.logger.info('Initiating getMe [SERVICE]',
      {
        methodName: this.getMe.name,
        fileName: __filename,
        userId,
      }
    );
    
    const user = await authDao.findById(userId);
    if (!user) throw new Error('User not found');
    return this.toMeResponse(user);
  }

  /**
   * verifyEmail
   * 
   * @description Handles email verification by accepting a token. Validates token and activates user account if valid. This method checks the provided email verification token against the stored token in the database, verifies its validity and expiration, and if valid, marks the user's email as verified. If the token is invalid or expired, appropriate errors are thrown.
   * 
   * @param {string} token - The email verification token provided by the user. This method validates the token against the stored verification token in the database, checks for expiration, and if valid, marks the user's email as verified. If the token is invalid or expired, appropriate errors are thrown.
   * @returns {Promise<void>} - A promise that resolves when the email verification process is complete.
   */
  async verifyEmail(token: string): Promise<void> {
    global.logger.info('Initiating email verification [SERVICE]',
      {
        methodName: this.verifyEmail.name,
        fileName: __filename,
        token,
      }
    );
    
    // Find user by email verification token
    const user = await authDao.findByEmailVerifyToken(token);

    // Validate token and check for expiration
    if (!user) throw new Error('Invalid or expired verification token');
    
    // Check if the verification token has expired
    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      throw new Error('Verification token expired');
    }

    // Mark email as verified and clear verification token fields
    await authDao.update(user.id, {
      isVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    });
  }

  /**
   * resendVerification
   * 
   * @description Resends the email verification link to the user. This method checks if the user exists and is not already verified, generates a new email verification token, updates the user's record in the database, and sends a new verification email to the user. If the user does not exist or is already verified, the method returns silently without throwing an error.
   * 
   * @param {ResendVerificationRequest} data - Object containing the email address for which to resend the verification email. This method checks if the user exists and is not already verified, generates a new email verification token, updates the user's record in the database, and sends a new verification email to the user. If the user does not exist or is already verified, the method returns silently without throwing an error.
   * @returns {Promise<void>} - A promise that resolves when the resend verification process is complete.
   */
  async resendVerification(data: ResendVerificationRequest): Promise<void> {
    global.logger.info('Initiating resendVerification [SERVICE]',
      {
        methodName: this.resendVerification.name,
        fileName: __filename,
        email: data.email,
      }
    );
    
    // Find user by email
    const user = await authDao.findByEmail(data.email);
    if (!user || user.isVerified) return; // silent

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await authDao.update(user.id, { emailVerifyToken: verifyToken, emailVerifyExpires: verifyExpires });

    sendEmail({
      to: user.email,
      subject: 'Verify your LeadFlow email',
      html: `<p>Click <a href="${process.env.BASE_URL}/api/v1/auth/verify-email/${verifyToken}">here</a> to verify your email.</p>`,
    }).catch(() => {});
  }

  /**
   * forgotPassword
   * 
   * @description Initiates the forgot password process by accepting an email address. This method checks if the user exists, generates a password reset token and expiration time, updates the user's record in the database, and sends a password reset email to the user. If the user does not exist, the method returns silently without throwing an error.
   * 
   * @param {ForgotPasswordRequest} data - Object containing the email address for which to initiate the forgot password process. This method checks if the user exists, generates a password reset token and expiration time, updates the user's record in the database, and sends a password reset email to the user. If the user does not exist, the method returns silently without throwing an error.
   * @returns {Promise<void>} - A promise that resolves when the forgot password process is complete.
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    global.logger.info('Initiating forgotPassword [SERVICE]',
      {
        methodName: this.forgotPassword.name,
        fileName: __filename,
        email: data.email,
      }
    );  

    // Find user by email
    const user = await authDao.findByEmail(data.email);
    
    // If user does not exist, return silently for security reasons
    if (!user) return; // silent for security

    // Generate password reset token and expiration time
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token to expire in 1 hour
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);
    
    // Update user's record with reset token and expiration
    await authDao.update(user.id, { passwordResetToken: resetToken, passwordResetExpires: resetExpires });

    sendEmail({
      to: user.email,
      subject: 'Reset your LeadFlow password',
      html: `<p>Your reset token: <code>${resetToken}</code>. Expires in 1 hour.</p>`,
    }).catch(() => {});
  }

  /**
   * resetPassword
   * 
   * @description Handles password reset by accepting a token and new password. Validates input, checks for existing user, and updates password if valid. This method checks the provided password reset token against the stored token in the database, verifies its validity and expiration, hashes the new password, and updates the user's record with the new password. If the token is invalid or expired, appropriate errors are thrown.
   * 
   * @param {ResetPasswordRequest} data - Object containing the password reset token and the new password. This method validates the provided token, checks for expiration, hashes the new password, and updates the user's record in the database with the new password. If the token is invalid or expired, appropriate errors are thrown.
   * @returns {Promise<void>} - A promise that resolves when the password reset process is complete.
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    global.logger.info('Initiating resetPassword [SERVICE]',
      {
        methodName: this.resetPassword.name,
        fileName: __filename,
        token: data.token,
      }
    );

    const user = await authDao.findByPasswordResetToken(data.token);
    if (!user) throw new Error('Invalid or expired reset token');
    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      throw new Error('Reset token expired');
    }
    const passwordHash = await hashPassword(data.password);
    await authDao.update(user.id, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  /**
   * generateTokens
   * 
   * @description Generates authentication tokens (access token and refresh token) for a given user. This method accepts a user object containing the user's ID, role, and token balance, and uses helper functions to sign the relevant information into JWT tokens. The generated access token includes the user's ID, role, and token balance, while the refresh token includes only the user's ID. The method returns an object containing both the access token and refresh token.
   * 
   * @param {object} user - The user object containing the user's ID, role, and token balance. This method generates authentication tokens (access token and refresh token) for the given user by signing the relevant information using helper functions. The generated tokens are then returned in an object format.
   * @returns {AuthTokens} - An object containing the generated access token and refresh token for the user.
   */
  private generateTokens(user: { id: string; role: string; tokenBalance: number }): AuthTokens {
    global.logger.info('Generating tokens [SERVICE]',
      {
        methodName: this.generateTokens.name,
        fileName: __filename,
        userId: user.id,
      }
    );
    
    // Generate access token with user ID, role, and token balance
    const accessToken = signAccess({ id: user.id, role: user.role, tokenBalance: user.tokenBalance });
    
    // Generate refresh token with user ID
    const refreshToken = signRefresh({ id: user.id });
    return { accessToken, refreshToken };
  }

  /**
   * Converts a user object to a MeResponse object.
   * @param user - The user object to convert.
   * @returns The converted MeResponse object.
   */
  private toMeResponse(user: any): MeResponse {
    global.logger.info('Converting user to MeResponse [SERVICE]',
      {
        methodName: this.toMeResponse.name,
        fileName: __filename,
        userId: user.id,
      }
    );
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      tokenBalance: user.tokenBalance,
      corporationId: user.corporationId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authService = new AuthService();
export default authService;
