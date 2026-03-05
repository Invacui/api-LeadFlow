// Express types
import { Request, Response } from 'express';

// Conversations service
import { conversationsService } from './Conversations.service';

// Response and pagination helpers
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * ConversationsController
 *
 * @description Controller for listing conversations, loading individual
 * threads, and sending replies. Delegates to `ConversationsService` and adds
 * pagination metadata where appropriate.
 */
export class ConversationsController {
  /**
   * List conversations for the authenticated user with pagination.
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating list conversations [CONTROLLER]', {
        methodName: this.list.name,
        fileName: __filename,
        userId: req.user!.id,
      });
      const [items, total] = await conversationsService.list(req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  /**
   * Get a single conversation by ID for the authenticated user.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating getById conversation [CONTROLLER]', {
        methodName: this.getById.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await conversationsService.getById(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Send a reply in the context of a conversation.
   */
  async reply(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating reply to conversation [CONTROLLER]', {
        methodName: this.reply.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await conversationsService.reply(req.params.id, req.user!.id, req.body);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }
}

export const conversationsController = new ConversationsController();
export default conversationsController;
