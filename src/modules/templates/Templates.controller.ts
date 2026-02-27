import { Request, Response } from 'express';
import { templatesService } from './Templates.service';
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

export class TemplatesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await templatesService.create(req.user!.id, req.body);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await templatesService.list(req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await templatesService.getById(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const result = await templatesService.update(req.params.id, req.user!.id, req.body);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await templatesService.delete(req.params.id, req.user!.id);
      success(res, { message: 'Template deleted' });
    } catch (err: any) { error(res, 404, err.message); }
  }

  async preview(req: Request, res: Response): Promise<void> {
    try {
      const result = await templatesService.preview(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async launch(req: Request, res: Response): Promise<void> {
    try {
      const result = await templatesService.launch(req.params.id, req.user!.id, req.body);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }
}

export const templatesController = new TemplatesController();
export default templatesController;
