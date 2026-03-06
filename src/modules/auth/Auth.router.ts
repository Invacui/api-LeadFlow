// External imports
import { Router } from 'express';

// Controller imports
import AuthController  from './Auth.controller';

// Middleware imports
import { validateRequest } from '@/shared/middleware/validateRequest';
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { authRateLimiter, strictRateLimiter } from '@/shared/middleware/rateLimiter';

// Validator imports
import {
  signupSchema, loginSchema, refreshSchema,
  forgotPasswordSchema, resetPasswordSchema, resendVerificationSchema,
} from './Auth.validator';

const authController = new AuthController();
const authRouter = Router();

global.logger.info('Initializing Auth Router', { fileName: __filename, methodName: 'AuthRouterInit' });

// Create
authRouter.post('/signup', authRateLimiter, validateRequest(signupSchema), authController.signup);
authRouter.post('/forgot-password', strictRateLimiter, validateRequest(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/reset-password', authRateLimiter, validateRequest(resetPasswordSchema), authController.resetPassword);

// Read
authRouter.get('/me', authRateLimiter, isLoggedIn, authController.me);

// Update
authRouter.post('/refresh', authRateLimiter, validateRequest(refreshSchema), authController.refresh);
authRouter.post('/resend-verification', authRateLimiter, validateRequest(resendVerificationSchema), authController.resendVerification);

// Delete
authRouter.post('/logout', authRateLimiter, isLoggedIn, authController.logout);

// Other
authRouter.post('/login', strictRateLimiter, validateRequest(loginSchema), authController.login);
authRouter.post('/verify-email/:token', authRateLimiter, authController.verifyEmail);

export default authRouter;
