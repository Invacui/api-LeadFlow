import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types';

// Legacy middleware - kept for old routes
export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const secretKey = process.env.JWT_ACCESS_SECRET || process.env.PRIVATE_TOKEN_KEY;

    if (!secretKey) {
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    let token: string | undefined;
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, secretKey) as JWTPayload & { id?: string };
    const userId = (decoded as any).id || decoded.userId;

    req.user = {
      id: userId,
      role: 'USER' as any,
      tokenBalance: 0,
    };

    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default isLoggedIn;
