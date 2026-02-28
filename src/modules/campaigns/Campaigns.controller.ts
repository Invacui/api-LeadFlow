// Express types
import { Request, Response } from 'express';

// Campaigns service
import { campaignsService } from './Campaigns.service';

// Response and pagination helpers
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * CampaignsController
 *
 * @description HTTP controller for campaign listing, lifecycle operations
 * (pause/resume), and reporting (logs and hot leads). Delegates business logic
 * to `CampaignsService` and handles HTTP-level concerns only.
 */
export class CampaignsController {
  /**
   * List campaigns for the authenticated user with pagination.
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating list campaigns [CONTROLLER]`, {
        methodName: this.list.name,
        fileName: __filename,
        userId: req.user!.id,
      });
      const [items, total] = await campaignsService.list(req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  /**
   * Get a single campaign by ID for the authenticated user.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating getById campaign [CONTROLLER]`, {
        methodName: this.getById.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await campaignsService.getById(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Pause a running campaign.
   */
  async pause(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating pause campaign [CONTROLLER]`, {
        methodName: this.pause.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await campaignsService.pause(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * Resume a paused campaign.
   */
  async resume(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating resume campaign [CONTROLLER]`, {
        methodName: this.resume.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await campaignsService.resume(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * Get engagement logs for a campaign with pagination metadata.
   */
  async getLogs(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating getLogs campaign [CONTROLLER]`, {
        methodName: this.getLogs.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const [items, total] = await campaignsService.getLogs(req.params.id, req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Get "hot leads" conversations for a campaign with pagination metadata.
   */
  async getHotLeads(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating getHotLeads campaign [CONTROLLER]`, {
        methodName: this.getHotLeads.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const [items, total] = await campaignsService.getHotLeads(req.params.id, req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 404, err.message); }
  }
}

export const campaignsController = new CampaignsController();
export default campaignsController;
