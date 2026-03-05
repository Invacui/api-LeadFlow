// Express types
import { Request, Response } from 'express';

// Admin service
import { adminService } from './Admin.service';

// Response and pagination helpers
import { success, error } from '@/shared/helpers/response.helper';
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * AdminController
 *
 * @description HTTP controller exposing admin-only endpoints for managing
 * users, lead requests, campaigns, and stats. All business rules live in
 * `AdminService`; this layer handles HTTP wiring and error mapping.
 */
export class AdminController {
  /**
   * Get paginated list of users for admin dashboard.
   */
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating getUsers [CONTROLLER]', {
        methodName: this.getUsers.name,
        fileName: __filename,
      });
      const [items, total] = await adminService.getUsers(req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  /**
   * Get a single user by ID.
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating getUserById [CONTROLLER]', {
        methodName: this.getUserById.name,
        fileName: __filename,
        id: req.params.id,
      });
      const result = await adminService.getUserById(req.params.id);
      success(res, result);
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Update a user's token balance.
   */
  async updateTokens(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating updateTokens [CONTROLLER]', {
        methodName: this.updateTokens.name,
        fileName: __filename,
        id: req.params.id,
      });
      const result = await adminService.updateTokens(req.params.id, req.body);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * Suspend or unsuspend a user account.
   */
  async suspendUser(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating suspendUser [CONTROLLER]', {
        methodName: this.suspendUser.name,
        fileName: __filename,
        id: req.params.id,
      });
      const { suspend } = req.body;
      if (typeof suspend !== 'boolean') {
        error(res, 400, '"suspend" must be a boolean');
        return;
      }
      const result = await adminService.suspendUser(req.params.id, suspend);
      success(res, result);
    } catch (err: any) { error(res, 400, err.message); }
  }

  /**
   * Soft-delete a user account.
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating deleteUser [CONTROLLER]', {
        methodName: this.deleteUser.name,
        fileName: __filename,
        id: req.params.id,
      });
      await adminService.deleteUser(req.params.id);
      success(res, { message: 'User deleted' });
    } catch (err: any) { error(res, 404, err.message); }
  }

  /**
   * Get paginated list of all lead requests in the system.
   */
  async getLeadRequests(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating getLeadRequests [CONTROLLER]', {
        methodName: this.getLeadRequests.name,
        fileName: __filename,
      });
      const [items, total] = await adminService.getLeadRequests(req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  /**
   * Get paginated list of all campaigns in the system.
   */
  async getCampaigns(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating getCampaigns [CONTROLLER]', {
        methodName: this.getCampaigns.name,
        fileName: __filename,
      });
      const [items, total] = await adminService.getCampaigns(req.query as any);
      const { page, limit } = paginate(req.query as any);
      success(res, items, 200, { total, page, limit });
    } catch (err: any) { error(res, 500, err.message); }
  }

  /**
   * Get aggregate statistics for users, leads, and campaigns.
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      global.logger.info('Initiating getStats [CONTROLLER]', {
        methodName: this.getStats.name,
        fileName: __filename,
      });
      const stats = await adminService.getStats();
      success(res, stats);
    } catch (err: any) { error(res, 500, err.message); }
  }
}

export const adminController = new AdminController();
export default adminController;
