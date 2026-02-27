import { Request, Response, NextFunction } from 'express';
import { UserResponse } from '@/interfaces/users.i';

export interface UserAuthResponse {
  user: UserResponse;
  token: string;
}

// Express request extensions
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    iat: number;
    exp: number;
  };
}

// Controller types
export type ControllerMethod = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

// Environment variables
export interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  DB_NAME: string;
  PRIVATE_TOKEN_KEY: string;
  BASE_URL: string;
}

// JWT payload
export interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

// Validation error
export interface ValidationError {
  message: string;
  details: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  details?: string[];
}
