import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        tokenBalance: number;
      };
      tokenUser?: {
        id: string;
        role: UserRole;
        tokenBalance: number;
      };
    }
  }
}

export {};
