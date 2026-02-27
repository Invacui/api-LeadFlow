import { Request, Response, NextFunction } from 'express';

const usedIPs = new Set<string>();

export const ipDemoGuard = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (usedIPs.has(ip)) {
    res.status(403).json({ success: false, error: 'Free demo already used for this IP. Please sign up.' });
    return;
  }
  usedIPs.add(ip);
  next();
};

export default ipDemoGuard;
