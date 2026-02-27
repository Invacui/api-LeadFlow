import crypto from 'crypto';
import { authDao } from './Auth.dao';
import { hashPassword, comparePassword } from '@/shared/helpers/password.helper';
import { signAccess, signRefresh, verifyRefresh } from '@/shared/helpers/token.helper';
import { sendEmail } from '@/shared/lib/resend.lib';
import { globalConstants } from '@/constants/Global.constants';
import {
  SignupRequest, LoginRequest, AuthTokens, MeResponse,
  ForgotPasswordRequest, ResetPasswordRequest, ResendVerificationRequest,
} from './Auth.dto';

export class AuthService {
  async signup(data: SignupRequest): Promise<{ tokens: AuthTokens; user: MeResponse }> {
    const existing = await authDao.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');

    const corp = await authDao.createCorporation(data.corporationName);
    const passwordHash = await hashPassword(data.password);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

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

  async login(data: LoginRequest): Promise<{ tokens: AuthTokens; user: MeResponse }> {
    const user = await authDao.findByEmail(data.email);
    if (!user || user.isDeleted || user.isSuspended) throw new Error('Invalid credentials');
    if (!user.passwordHash) throw new Error('Invalid credentials');

    const valid = await comparePassword(data.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const tokens = this.generateTokens(user);
    await authDao.update(user.id, { refreshToken: tokens.refreshToken });

    return { tokens, user: this.toMeResponse(user) };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = verifyRefresh(refreshToken);
    const user = await authDao.findByRefreshToken(refreshToken);
    if (!user || user.id !== payload.id) throw new Error('Invalid refresh token');
    if (user.isDeleted || user.isSuspended) throw new Error('Account suspended');

    const accessToken = signAccess({ id: user.id, role: user.role, tokenBalance: user.tokenBalance });
    return { accessToken };
  }

  async logout(userId: string): Promise<void> {
    await authDao.update(userId, { refreshToken: null });
  }

  async getMe(userId: string): Promise<MeResponse> {
    const user = await authDao.findById(userId);
    if (!user) throw new Error('User not found');
    return this.toMeResponse(user);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await authDao.findByEmailVerifyToken(token);
    if (!user) throw new Error('Invalid or expired verification token');
    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      throw new Error('Verification token expired');
    }
    await authDao.update(user.id, {
      isVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    });
  }

  async resendVerification(data: ResendVerificationRequest): Promise<void> {
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

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    const user = await authDao.findByEmail(data.email);
    if (!user) return; // silent for security

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await authDao.update(user.id, { passwordResetToken: resetToken, passwordResetExpires: resetExpires });

    sendEmail({
      to: user.email,
      subject: 'Reset your LeadFlow password',
      html: `<p>Your reset token: <code>${resetToken}</code>. Expires in 1 hour.</p>`,
    }).catch(() => {});
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
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

  private generateTokens(user: { id: string; role: string; tokenBalance: number }): AuthTokens {
    const accessToken = signAccess({ id: user.id, role: user.role, tokenBalance: user.tokenBalance });
    const refreshToken = signRefresh({ id: user.id });
    return { accessToken, refreshToken };
  }

  private toMeResponse(user: any): MeResponse {
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
