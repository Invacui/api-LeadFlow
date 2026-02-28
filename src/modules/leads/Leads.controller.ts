// Express types
import { Request, Response } from 'express';

// Leads service
import { leadsService } from './Leads.service';

// Response and pagination helpers
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * LeadsController
 *
 * @description Controller for lead request imports (upload/link), listing lead
 * requests, accessing original files, and listing parsed leads. Delegates all
 * business rules to `LeadsService`.
 */
export class LeadsController {
  /**
   * Handle CSV file uploads for creating lead requests.
   */
  async upload(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating upload lead [CONTROLLER]`, {
        methodName: this.upload.name,
        fileName: __filename,
        userId: req.user!.id,
      });
      // Multer-like middleware attaches the uploaded file to `req.file`.
      const file = (req as any).file;
      if (!file) { error(res, 400, 'No file uploaded'); return; }
      const result = await leadsService.uploadLead(req.user!.id, req.body, file.buffer, file.originalname);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * Handle link-based lead request creation.
   */
  async link(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating link lead [CONTROLLER]`, {
        methodName: this.link.name,
        fileName: __filename,
        userId: req.user!.id,
      });
      const result = await leadsService.linkLead(req.user!.id, req.body);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * List lead requests for the authenticated user with pagination metadata.
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating list lead requests [CONTROLLER]`, {
        methodName: this.list.name,
        fileName: __filename,
        userId: req.user!.id,
      });
      const [items, total] = await leadsService.list(req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  /**
   * Get a single lead request by ID for the authenticated user.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating getById lead request [CONTROLLER]`, {
        methodName: this.getById.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await leadsService.getById(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Get a signed URL for downloading the original leads file.
   */
  async getFileUrl(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating getFileUrl lead request [CONTROLLER]`, {
        methodName: this.getFileUrl.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const url = await leadsService.getSignedFileUrl(req.params.id, req.user!.id);
      success(res, { url });
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * List parsed leads for a specific lead request with pagination metadata.
   */
  async getLeads(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating getLeads [CONTROLLER]`, {
        methodName: this.getLeads.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const [items, total] = await leadsService.getLeads(req.params.id, req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Soft-delete a lead request for the authenticated user.
   */
  async softDelete(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating softDelete lead request [CONTROLLER]`, {
        methodName: this.softDelete.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      await leadsService.softDelete(req.params.id, req.user!.id);
      success(res, { message: 'Lead request deleted' });
    } catch (err: any) { error(res, 404, err.message); }
  }
}

export const leadsController = new LeadsController();
export default leadsController;
