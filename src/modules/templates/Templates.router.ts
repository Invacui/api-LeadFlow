import { Router } from 'express';
import { templatesController } from './Templates.controller';
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { validateRequest } from '@/shared/middleware/validateRequest';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';
import { createTemplateSchema, updateTemplateSchema, launchCampaignSchema } from './Templates.validator';

const router = Router();
router.use(apiRateLimiter, isLoggedIn);

router.post('/', validateRequest(createTemplateSchema), (req, res) => templatesController.create(req, res));
router.get('/', (req, res) => templatesController.list(req, res));
router.get('/:id', (req, res) => templatesController.getById(req, res));
router.patch('/:id', validateRequest(updateTemplateSchema), (req, res) => templatesController.update(req, res));
router.delete('/:id', (req, res) => templatesController.delete(req, res));
router.post('/:id/preview', (req, res) => templatesController.preview(req, res));
router.post('/:id/launch', validateRequest(launchCampaignSchema), (req, res) => templatesController.launch(req, res));

export default router;
