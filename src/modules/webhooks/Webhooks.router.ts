// Express router
import { Router } from 'express';

// Webhooks controller
import WebhooksController from './Webhooks.controller';

// Middleware
import { webhookRateLimiter } from '@/shared/middleware/rateLimiter';

const router = Router();
const webhooksController = new WebhooksController();
router.use(webhookRateLimiter);

router.post('/email-reply', webhooksController.emailReply);
router.post('/wa-reply', webhooksController.waReply);
router.get('/wa-verify', webhooksController.waVerifyGet);
router.post('/wa-verify', webhooksController.waVerifyPost);

export default router;
