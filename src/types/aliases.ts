/**
 * TypeScript Path Aliases Reference
 *
 * This file documents all available path aliases for the project.
 * Use these aliases instead of relative imports for cleaner, more maintainable code.
 */

// Main application files
export type App = typeof import('@/app');
export type Server = typeof import('@/server');

// Configuration
export type EnvironmentConfig = typeof import('@/config/environment');

// Constants
export type GlobalConstants = typeof import('@/constants/Global.constants');

// Controllers
export type AuthController = typeof import('@/controllers/Auth.controller');

// DAO (Data Access Objects)
export type AuthDao = typeof import('@/dao/Auth.dao');

// Database
export type PrismaClient = typeof import('@/db/prisma');

// Interfaces (DTOs)
export type UserDto = typeof import('@/interfaces/Auth.dto');

// Logger
export type Logger = typeof import('@/logger/logger');

// Middleware
export type IsLoggedIn = typeof import('@/middleware/IsLoggedIn');

// Routes
export type AuthRouter = typeof import('@/routes/Auth.router');
export type MainRoutes = typeof import('@/routes/Index.routes');

// Services
export type AuthService = typeof import('@/services/Auth.service');

// Types
export type {
  CreateUserRequest,
  UserResponse,
  AuthResponse,
  AuthenticatedRequest,
  ControllerMethod,
  ValidationError,
  ApiResponse,
  ErrorResponse,
  EnvironmentVariables,
  JWTPayload,
} from '@/types/index';

// Validators
export type AuthValidator = typeof import('@/validators/Auth.validator');

// Tests
export type AuthTest = typeof import('@/tests/auth.test');
// Note: @/test/* aliases are for test files outside src directory

// Prisma
// Note: Prisma schema is not directly importable as a TypeScript module

// Environment
// Note: Environment files are loaded by the environment configuration system

/**
 * Alias Usage Examples:
 *
 * // Instead of:
 * import { UserDto } from '../interfaces/Auth.dto';
 * import { authService } from '../services/Auth.service';
 * import { CreateUserRequest } from '../types';
 *
 * // Use:
 * import { UserDto } from '@/interfaces/Auth.dto';
 * import { authService } from '@/services/Auth.service';
 * import { CreateUserRequest } from '@/types';
 *
 * // For main files:
 * import App from '@/app';
 * import { prisma } from '@/db/prisma';
 *
 *
 * // For configuration:
 * import envConfig from '@/config/environment';
 * import { globalConstants } from '@/constants/Global.constants';
 *
 * // For tests:
 * import { authService } from '@/services/Auth.service';
 * import { prisma } from '@/db/prisma';
 */
