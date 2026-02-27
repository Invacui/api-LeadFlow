import { UserRole } from '@prisma/client';

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  corporationName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface TokenUserPayload {
  id: string;
  role: UserRole;
  tokenBalance: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  tokenBalance: number;
  corporationId: string;
  createdAt: Date;
  updatedAt: Date;
}
