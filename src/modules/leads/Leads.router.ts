// Express router
import { Router } from 'express';

// Leads controller
import LeadsController from './Leads.controller';

// Middleware
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { validateRequest } from '@/shared/middleware/validateRequest';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';

// Validators
import { createByLinkSchema } from './Leads.validator';

const router = Router();
const leadsController = new LeadsController();

// Handler using middleware to check if user is logged in and apply rate limiting to all routes in this router
router.use(apiRateLimiter, isLoggedIn);

// Create
router.post('/upload', leadsController.upload);
router.post('/link', validateRequest(createByLinkSchema), leadsController.link);

// Read
router.get('/', leadsController.list);
router.get('/:id', leadsController.getById);
router.get('/:id/file', leadsController.getFileUrl);
router.get('/:id/leads', leadsController.getLeads);

// Delete
router.delete('/:id', leadsController.softDelete);

export default router;
