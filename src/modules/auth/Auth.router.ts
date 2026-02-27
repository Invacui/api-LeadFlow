import { Router } from 'express';
import { authController } from './Auth.controller';
import { validateRequest } from '@/shared/middleware/validateRequest';
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { authRateLimiter, strictRateLimiter } from '@/shared/middleware/rateLimiter';
import {
  signupSchema, loginSchema, refreshSchema,
  forgotPasswordSchema, resetPasswordSchema, resendVerificationSchema,
} from './Auth.validator';

const router = Router();

router.post('/signup', authRateLimiter, validateRequest(signupSchema), (req, res) => authController.signup(req, res));
router.post('/login', strictRateLimiter, validateRequest(loginSchema), (req, res) => authController.login(req, res));
router.post('/refresh', authRateLimiter, validateRequest(refreshSchema), (req, res) => authController.refresh(req, res));
router.post('/logout', authRateLimiter, isLoggedIn, (req, res) => authController.logout(req, res));
router.get('/me', authRateLimiter, isLoggedIn, (req, res) => authController.me(req, res));
router.post('/verify-email/:token', authRateLimiter, (req, res) => authController.verifyEmail(req, res));
router.post('/resend-verification', authRateLimiter, validateRequest(resendVerificationSchema), (req, res) => authController.resendVerification(req, res));
router.post('/forgot-password', strictRateLimiter, validateRequest(forgotPasswordSchema), (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', authRateLimiter, validateRequest(resetPasswordSchema), (req, res) => authController.resetPassword(req, res));

export default router;
