// Express router
import { Router } from 'express';

// Admin controller
import AdminController from './Admin.controller';

// Middleware
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { requireRole } from '@/shared/middleware/requireRole';
import { validateRequest } from '@/shared/middleware/validateRequest';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';

// Validators
import { updateTokensSchema } from './Admin.validator';

const router = Router();
const adminController = new AdminController();
router.use(apiRateLimiter, isLoggedIn, requireRole(['ADMIN']));

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/tokens', validateRequest(updateTokensSchema), adminController.updateTokens);
router.patch('/users/:id/suspend', adminController.suspendUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/lead-requests', adminController.getLeadRequests);
router.get('/campaigns', adminController.getCampaigns);
router.get('/stats', adminController.getStats);

export default router;
