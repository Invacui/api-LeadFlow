import { Request, Response } from 'express';
import { campaignsService } from './Campaigns.service';
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

export class CampaignsController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await campaignsService.list(req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await campaignsService.getById(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  async pause(req: Request, res: Response): Promise<void> {
    try {
      const result = await campaignsService.pause(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async resume(req: Request, res: Response): Promise<void> {
    try {
      const result = await campaignsService.resume(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await campaignsService.getLogs(req.params.id, req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 404, err.message); }
  }

  async getHotLeads(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await campaignsService.getHotLeads(req.params.id, req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 404, err.message); }
  }
}

export const campaignsController = new CampaignsController();
export default campaignsController;
