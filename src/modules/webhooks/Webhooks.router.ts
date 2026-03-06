// Express router
import { Router } from 'express';

// Webhooks controller
import WebhooksController from './Webhooks.controller';

// Middleware
import { webhookRateLimiter } from '@/shared/middleware/rateLimiter';

const router = Router();
const webhooksController = new WebhooksController();
router.use(webhookRateLimiter);

router.post('/email-reply', (req, res) => webhooksController.emailReply(req, res));
router.post('/wa-reply', (req, res) => webhooksController.waReply(req, res));
router.get('/wa-verify', (req, res) => webhooksController.waVerifyGet(req, res));
router.post('/wa-verify', (req, res) => webhooksController.waVerifyPost(req, res));

export default router;
