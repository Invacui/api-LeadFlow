import { Request, Response } from 'express';
import { adminService } from './Admin.service';
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

export class AdminController {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await adminService.getUsers(req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const result = await adminService.getUserById(req.params.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  async updateTokens(req: Request, res: Response): Promise<void> {
    try {
      const result = await adminService.updateTokens(req.params.id, req.body);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async suspendUser(req: Request, res: Response): Promise<void> {
    try {
      const suspend = req.body.suspend !== false;
      const result = await adminService.suspendUser(req.params.id, suspend);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await adminService.deleteUser(req.params.id);
      success(res, { message: 'User deleted' });
    } catch (err: any) { error(res, 404, err.message); }
  }

  async getLeadRequests(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await adminService.getLeadRequests(req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  async getCampaigns(req: Request, res: Response): Promise<void> {
    try {
      const [items, total] = await adminService.getCampaigns(req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminService.getStats();
      success(res, stats);
    } catch (err: any) { error(res, 500, err.message); }
  }
}

export const adminController = new AdminController();
export default adminController;
