// Import express signatures
import { Request, Response } from 'express';

// Import auth service 
import { authService } from './Auth.service';

// Import response helpers
import { success, error } from '@/shared/helpers/response.helper';

/**
 * AuthController
 * 
 * @description Controller class for handling authentication-related operations such as user signup, login, token refresh, logout, and email verification. Each method corresponds to a specific authentication action and interacts with the AuthService to perform the necessary business logic. The controller also handles request validation and response formatting, ensuring that appropriate success or error messages are returned based on the outcome of each operation.
 */
class AuthController {

  /**
   * User signup
   * 
   * @description Handles user registration by accepting email, password, and corporation name. Validates input, checks for existing email, creates new user, and sends verification email. Returns success message on successful registration or appropriate error messages for validation failures or if email is already registered.
   * 
   * @param req - Express request object
   * @param res - Express response object
   */
  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating signup [CONTROLLER]',
        {
          methodName: 'signup',
          fileName: __filename,
          email: req.body.email,
          corporationName: req.body.corporationName,
        }
      );
      const result = await authService.signup(req.body);
      success(res, result, 201);
    } catch (err: any) {
      const status = err.message === 'Email already registered' ? 409 : 400;
      error(res, status, err.message);
    }
  };

  /**
   * User login
   *
   * @description Handles user login by accepting email and password. Validates input, checks for existing user, and returns access token on successful login or appropriate error messages for validation failures or if user is not found.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating login [CONTROLLER]',
        {
          methodName: 'login',
          fileName: __filename,
          email: req.body.email,
        }
      );
      const result = await authService.login(req.body);
      success(res, result);
    } catch (err: any) {
      error(res, 401, err.message);
    }
  };

  /**
   * Refresh access token
   * 
   * @description Handles token refresh by accepting a refresh token. Validates input, checks for existing user, and returns new access token on successful refresh or appropriate error messages for validation failures or if user is not found.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating refresh [CONTROLLER]',
        {
          methodName: 'refresh',
          fileName: __filename,
          userId: req.user!.id,
        }
      );
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      success(res, result);
    } catch (err: any) {
      error(res, 401, err.message);
    }
  };

  /**
   * User logout
   *
   * @description Handles user logout by invalidating the access token and refresh token. Returns success message on successful logout or appropriate error messages if user is not found.
   * 
   * @param req - Express request object
   * @param res - Express response object
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating logout [CONTROLLER]',
        {
          methodName: 'logout',
          fileName: __filename,
          userId: req.user!.id,
        }
      );
      await authService.logout(req.user!.id);
      success(res, { message: 'Logged out successfully' });
    } catch (err: any) {
      error(res, 500, err.message);
    }
  };

  /**
   * Get current user information
   *
   * @description Retrieves the information of the currently authenticated user.
   * 
   * @param req 
   * @param res 
   */
  me = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating me [CONTROLLER]',
        {
          methodName: 'me',
          fileName: __filename,
          userId: req.user!.id,
        }
      );
      const user = await authService.getMe(req.user!.id);
      success(res, user);
    } catch (err: any) {
      error(res, 404, err.message);
    }
  };

  /**
   * Verify user email
   *
   * @description Handles email verification by accepting a token. Validates token and activates user account if valid.
   * 
   * @param req 
   * @param res 
   */
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating verifyEmail [CONTROLLER]',
        {
          methodName: 'verifyEmail',
          fileName: __filename,
          token: req.params.token,
        }
      );
      await authService.verifyEmail(req.params.token);
      success(res, { message: 'Email verified successfully' });
    } catch (err: any) {
      error(res, 400, err.message);
    }
  };

  /**
   * Resend verification email
   * 
   * @description Handles resending of verification email by accepting an email address. Validates input and sends a new verification email if the account exists and is not already verified.
   * 
   * @param req - Express request object
   * @param res - Express response object
   */
  resendVerification = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating resendVerification [CONTROLLER]',
        {
          methodName: 'resendVerification',
          fileName: __filename,
          email: req.body.email,
        }
      );
      await authService.resendVerification(req.body);
      success(res, { message: 'Verification email sent if account exists' });
    } catch (err: any) {
      error(res, 500, err.message);
    }
  };

  /**
   * Handle forgot password
   *
   * @description Handles password reset requests by accepting an email address. Validates input and sends a password reset email if the account exists.
   * 
   * @param req 
   * @param res 
   */
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating forgotPassword [CONTROLLER]',
        {
          methodName: 'forgotPassword',
          fileName: __filename,
          email: req.body.email,
        }
      );
      await authService.forgotPassword(req.body);
      success(res, { message: 'Reset email sent if account exists' });
    } catch (err: any) {
      error(res, 500, err.message);
    }
  };

  /**
   * Reset user password
   *
   * @description Handles password reset by accepting a token and new password. Validates input, checks for existing user, and updates password if valid.
   * 
   * @param req - Express request object
   * @param res - Express response object
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating resetPassword [CONTROLLER]',
        {
          methodName: 'resetPassword',
          fileName: __filename,
          token: req.body.token,
        }
      );
      await authService.resetPassword(req.body);
      success(res, { message: 'Password reset successfully' });
    } catch (err: any) {
      error(res, 400, err.message);
    }
  };
}

export default AuthController;
