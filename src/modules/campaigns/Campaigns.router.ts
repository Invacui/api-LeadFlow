import { Router } from 'express';
import { campaignsController } from './Campaigns.controller';
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';

const router = Router();
router.use(apiRateLimiter, isLoggedIn);

router.get('/', (req, res) => campaignsController.list(req, res));
router.get('/:id', (req, res) => campaignsController.getById(req, res));
router.patch('/:id/pause', (req, res) => campaignsController.pause(req, res));
router.patch('/:id/resume', (req, res) => campaignsController.resume(req, res));
router.get('/:id/logs', (req, res) => campaignsController.getLogs(req, res));
router.get('/:id/hot-leads', (req, res) => campaignsController.getHotLeads(req, res));

export default router;
