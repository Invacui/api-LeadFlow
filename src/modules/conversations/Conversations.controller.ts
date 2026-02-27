import { Request, Response } from 'express';
import { conversationsService } from './Conversations.service';
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

export class ConversationsController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await conversationsService.list(req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await conversationsService.getById(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  async reply(req: Request, res: Response): Promise<void> {
    try {
      const result = await conversationsService.reply(req.params.id, req.user!.id, req.body);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }
}

export const conversationsController = new ConversationsController();
export default conversationsController;
