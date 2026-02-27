import { Router } from 'express';
import { conversationsController } from './Conversations.controller';
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { validateRequest } from '@/shared/middleware/validateRequest';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';
import { replySchema } from './Conversations.validator';

const router = Router();
router.use(apiRateLimiter, isLoggedIn);

router.get('/', (req, res) => conversationsController.list(req, res));
router.get('/:id', (req, res) => conversationsController.getById(req, res));
router.post('/:id/reply', validateRequest(replySchema), (req, res) => conversationsController.reply(req, res));

export default router;
