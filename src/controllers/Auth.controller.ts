import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ControllerMethod } from '@/types';

export class UserAuthController {
  createUser: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };

  getUserByAttrb: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };

  getAllUsers: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };

  updateUser: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };

  deleteUser: ControllerMethod = async (_req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(501).json({ success: false, error: 'Use /api/v1/auth endpoints' });
  };
}

export default UserAuthController;
