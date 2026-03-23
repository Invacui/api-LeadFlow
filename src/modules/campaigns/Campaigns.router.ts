// Express router
import { Router } from 'express';

// Campaigns controller
import CampaignsController from './Campaigns.controller';

// Middleware
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';

const router = Router();
const campaignsController = new CampaignsController();
router.use(apiRateLimiter, isLoggedIn);

router.get('/', campaignsController.list);
router.get('/:id', campaignsController.getById);
router.patch('/:id/pause', campaignsController.pause);
router.patch('/:id/resume', campaignsController.resume);
router.get('/:id/logs', campaignsController.getLogs);
router.get('/:id/hot-leads', campaignsController.getHotLeads);

export default router;
