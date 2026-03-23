// Express router
import { Router } from 'express';

// Templates controller
import TemplatesController from './Templates.controller';

// Middleware
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { validateRequest } from '@/shared/middleware/validateRequest';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';

// Validators
import { createTemplateSchema, updateTemplateSchema, launchCampaignSchema } from './Templates.validator';

const router = Router();
const templatesController = new TemplatesController();
router.use(apiRateLimiter, isLoggedIn);

router.post('/', validateRequest(createTemplateSchema), templatesController.create);
router.get('/', templatesController.list);
router.get('/:id', templatesController.getById);
router.patch('/:id', validateRequest(updateTemplateSchema), templatesController.update);
router.delete('/:id', templatesController.delete);
router.post('/:id/preview', templatesController.preview);
router.post('/:id/launch', validateRequest(launchCampaignSchema), templatesController.launch);

export default router;
