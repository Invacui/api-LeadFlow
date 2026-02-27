import { Request, Response, NextFunction } from 'express';

export const tokenGate = (required: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    if (req.user.tokenBalance < required) {
      res.status(402).json({ success: false, error: `Insufficient token balance. Required: ${required}, Available: ${req.user.tokenBalance}` });
      return;
    }
    next();
  };
};

export default tokenGate;
