// Express router
import { Router } from 'express';

// Conversations controller
import ConversationsController from './Conversations.controller';

// Middleware
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { validateRequest } from '@/shared/middleware/validateRequest';
import { apiRateLimiter } from '@/shared/middleware/rateLimiter';

// Validators
import { replySchema } from './Conversations.validator';

const router = Router();
const conversationsController = new ConversationsController();
router.use(apiRateLimiter, isLoggedIn);

router.get('/', conversationsController.list);
router.get('/:id', conversationsController.getById);
router.post('/:id/reply', validateRequest(replySchema), conversationsController.reply);

export default router;
