// Express router
import { Router } from 'express';

// Leads controller
import { leadsController } from './Leads.controller';

// Middleware
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { validateRequest } from '@/shared/middleware/validateRequest';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';

// Validators
import { createByLinkSchema } from './Leads.validator';

const router = Router();
router.use(apiRateLimiter, isLoggedIn);

router.post('/upload', (req, res) => leadsController.upload(req, res));
router.post('/link', validateRequest(createByLinkSchema), (req, res) => leadsController.link(req, res));
router.get('/', (req, res) => leadsController.list(req, res));
router.get('/:id', (req, res) => leadsController.getById(req, res));
router.get('/:id/file', (req, res) => leadsController.getFileUrl(req, res));
router.get('/:id/leads', (req, res) => leadsController.getLeads(req, res));
router.delete('/:id', (req, res) => leadsController.softDelete(req, res));

export default router;
