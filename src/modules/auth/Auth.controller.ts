import { Request, Response } from 'express';
import { authService } from './Auth.service';
import { success, error } from '@/shared/helpers/response.helper';

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.signup(req.body);
      success(res, result, 201);
    } catch (err: any) {
      const status = err.message === 'Email already registered' ? 409 : 400;
      error(res, status, err.message);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      success(res, result);
    } catch (err: any) {
      error(res, 401, err.message);
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      success(res, result);
    } catch (err: any) {
      error(res, 401, err.message);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      await authService.logout(req.user!.id);
      success(res, { message: 'Logged out successfully' });
    } catch (err: any) {
      error(res, 500, err.message);
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.getMe(req.user!.id);
      success(res, user);
    } catch (err: any) {
      error(res, 404, err.message);
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      await authService.verifyEmail(req.params.token);
      success(res, { message: 'Email verified successfully' });
    } catch (err: any) {
      error(res, 400, err.message);
    }
  }

  async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      await authService.resendVerification(req.body);
      success(res, { message: 'Verification email sent if account exists' });
    } catch (err: any) {
      error(res, 500, err.message);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      await authService.forgotPassword(req.body);
      success(res, { message: 'Reset email sent if account exists' });
    } catch (err: any) {
      error(res, 500, err.message);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      await authService.resetPassword(req.body);
      success(res, { message: 'Password reset successfully' });
    } catch (err: any) {
      error(res, 400, err.message);
    }
  }
}

export const authController = new AuthController();
export default authController;
