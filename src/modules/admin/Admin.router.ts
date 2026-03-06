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

router.get('/users', (req, res) => adminController.getUsers(req, res));
router.get('/users/:id', (req, res) => adminController.getUserById(req, res));
router.patch('/users/:id/tokens', validateRequest(updateTokensSchema), (req, res) => adminController.updateTokens(req, res));
router.patch('/users/:id/suspend', (req, res) => adminController.suspendUser(req, res));
router.delete('/users/:id', (req, res) => adminController.deleteUser(req, res));
router.get('/lead-requests', (req, res) => adminController.getLeadRequests(req, res));
router.get('/campaigns', (req, res) => adminController.getCampaigns(req, res));
router.get('/stats', (req, res) => adminController.getStats(req, res));

export default router;
