import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ControllerMethod } from '@/types';

/**
 * UserAuthController
 *
 * @description Legacy controller for the original auth routes. All methods are
 * intentionally stubbed and respond with HTTP 501 to steer clients toward the
 * newer `/api/v1/auth` endpoints implemented in `modules/auth`. Kept only for
 * backward compatibility during migration.
 */
export class UserAuthController {
  /**
   * Legacy create user endpoint – always returns 501 with migration guidance.
   */
  createUser: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };

  /**
   * Legacy get user by attribute endpoint – always returns 501.
   */
  getUserByAttrb: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };

  /**
   * Legacy list users endpoint – always returns 501.
   */
  getAllUsers: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };

  /**
   * Legacy update user endpoint – always returns 501.
   */
  updateUser: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };

  /**
   * Legacy delete user endpoint – always returns 501.
   */
  deleteUser: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };
}

export default UserAuthController;
