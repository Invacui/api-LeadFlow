import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
  id: string;
  role: string;
  tokenBalance: number;
}

export interface RefreshTokenPayload {
  id: string;
}

export const signAccess = (payload: AccessTokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.PRIVATE_TOKEN_KEY || 'dev-secret';
  return jwt.sign(payload, secret, { expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as any });
};

export const signRefresh = (payload: RefreshTokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.PRIVATE_TOKEN_KEY || 'dev-secret';
  return jwt.sign(payload, secret, { expiresIn: (process.env.JWT_REFRESH_EXPIRES || '7d') as any });
};

export const verifyAccess = (token: string): AccessTokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.PRIVATE_TOKEN_KEY || 'dev-secret';
  return jwt.verify(token, secret) as AccessTokenPayload;
};

export const verifyRefresh = (token: string): RefreshTokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.PRIVATE_TOKEN_KEY || 'dev-secret';
  return jwt.verify(token, secret) as RefreshTokenPayload;
};
