import { Request, Response, NextFunction } from 'express';
import prisma from '@/db/prisma';
import { verifyAccess } from '@/shared/helpers/token.helper';

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'No token provided' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccess(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, tokenBalance: true, isSuspended: true, isDeleted: true },
    });
    if (!user || user.isDeleted || user.isSuspended) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    req.user = { id: user.id, role: user.role, tokenBalance: user.tokenBalance };
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

export default isLoggedIn;
