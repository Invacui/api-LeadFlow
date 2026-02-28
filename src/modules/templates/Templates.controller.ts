// Express types
import { Request, Response } from 'express';

// Templates service
import { templatesService } from './Templates.service';

// Response and pagination helpers
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * TemplatesController
 *
 * @description Controller for managing message templates. Exposes CRUD operations,
 * preview generation, and campaign launch endpoints. Each handler delegates to
 * `TemplatesService` and is responsible only for HTTP concerns such as status
 * codes, pagination metadata, and error mapping.
 */
export class TemplatesController {
  /**
   * Create a new template for the authenticated user.
   *
   * @param req Express request containing template fields in `body`.
   * @param res Express response used to send the created template.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating create template [CONTROLLER]`, {
        methodName: this.create.name,
        fileName: __filename,
        userId: req.user!.id,
      });
      const result = await templatesService.create(req.user!.id, req.body);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * List templates for the authenticated user with pagination.
   *
   * @param req Express request containing pagination query parameters.
   * @param res Express response used to send the paginated templates.
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating list templates [CONTROLLER]`, {
        methodName: this.list.name,
        fileName: __filename,
        userId: req.user!.id,
      });
      const [items, total] = await templatesService.list(req.user!.id, req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  /**
   * Get a single template by ID for the authenticated user.
   *
   * @param req Express request containing the template ID in `params`.
   * @param res Express response used to send the template.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating getById template [CONTROLLER]`, {
        methodName: this.getById.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await templatesService.getById(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Update a template owned by the authenticated user.
   *
   * @param req Express request with template ID in `params` and partial update
   *            payload in `body`.
   * @param res Express response used to send the updated template.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating update template [CONTROLLER]`, {
        methodName: this.update.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await templatesService.update(req.params.id, req.user!.id, req.body);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * Delete a template owned by the authenticated user.
   *
   * @param req Express request containing the template ID in `params`.
   * @param res Express response used to send a confirmation message.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating delete template [CONTROLLER]`, {
        methodName: this.delete.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      await templatesService.delete(req.params.id, req.user!.id);
      success(res, { message: 'Template deleted' });
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Generate a sample preview for a template (email/WhatsApp content).
   *
   * @param req Express request containing the template ID in `params`.
   * @param res Express response used to send the generated preview.
   */
  async preview(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating preview template [CONTROLLER]`, {
        methodName: this.preview.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await templatesService.preview(req.params.id, req.user!.id);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * Launch a campaign from a template for the authenticated user.
   *
   * @param req Express request with template ID in `params` and launch
   *            configuration in `body`.
   * @param res Express response used to send the created campaign.
   */
  async launch(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info(`Initiating launch campaign [CONTROLLER]`, {
        methodName: this.launch.name,
        fileName: __filename,
        id: req.params.id,
        userId: req.user!.id,
      });
      const result = await templatesService.launch(req.params.id, req.user!.id, req.body);
      success(res, result, 201);
    } catch (err: any) { error(res, 400, err.message); }
  }
}

export const templatesController = new TemplatesController();
export default templatesController;
