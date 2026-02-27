import { Request, Response } from 'express';
import { leadsService } from './Leads.service';
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

export class LeadsController {
  async upload(req: Request, res: Response): Promise<void> {
    try {
      const file = (req as any).file;
      if (!file) { error(res, 400, 'No file uploaded'); return; }
      const result = await leadsService.uploadLead(req.user!.id, req.body, file.buffer, file.originalname);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async link(req: Request, res: Response): Promise<void> {
    try {
      const result = await leadsService.linkLead(req.user!.id, req.body);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await leadsService.list(req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await leadsService.getById(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  async getFileUrl(req: Request, res: Response): Promise<void> {
    try {
      const url = await leadsService.getSignedFileUrl(req.params.id, req.user!.id);
      success(res, { url });
    } catch (err: any) { error(res, 404, err.message); }
  }

  async getLeads(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await leadsService.getLeads(req.params.id, req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 404, err.message); }
  }

  async softDelete(req: Request, res: Response): Promise<void> {
    try {
      await leadsService.softDelete(req.params.id, req.user!.id);
      success(res, { message: 'Lead request deleted' });
    } catch (err: any) { error(res, 404, err.message); }
  }
}

export const leadsController = new LeadsController();
export default leadsController;
