// Data Access Object for admin operations
import { adminDao } from './Admin.dao';

// Data Transfer Objects
import { UpdateTokensRequest } from './Admin.dto';

/**
 * AdminService
 *
 * @description Administrative business operations for users, lead requests,
 * campaigns, and high-level stats. Delegates persistence to `AdminDao` while
 * enforcing basic invariants such as existence checks.
 */
export class AdminService {
  /**
   * Get all users with pagination.
   */
  async getUsers(query: Record<string, any>) {
    global.logger.info(`Initiating getUsers [SERVICE]`, {
      methodName: this.getUsers.name,
      fileName: __filename,
    });
    return adminDao.getAllUsers(query);
  }

  /**
   * Get a single user by ID.
   *
   * @throws Error when the user is not found.
   */
  async getUserById(id: string) {
    global.logger.info(`Initiating getUserById [SERVICE]`, {
      methodName: this.getUserById.name,
      fileName: __filename,
      id,
    });
    const user = await adminDao.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  /**
   * Update a user's token balance.
   */
  async updateTokens(id: string, data: UpdateTokensRequest) {
    global.logger.info(`Initiating updateTokens [SERVICE]`, {
      methodName: this.updateTokens.name,
      fileName: __filename,
      id,
    });
    return adminDao.updateTokenBalance(id, data.tokenBalance);
  }

  /**
   * Suspend or unsuspend a user account.
   */
  async suspendUser(id: string, suspend: boolean) {
    global.logger.info(`Initiating suspendUser [SERVICE]`, {
      methodName: this.suspendUser.name,
      fileName: __filename,
      id,
      suspend,
    });
    return adminDao.suspendUser(id, suspend);
  }

  /**
   * Soft-delete a user account.
   */
  async deleteUser(id: string) {
    global.logger.info(`Initiating deleteUser [SERVICE]`, {
      methodName: this.deleteUser.name,
      fileName: __filename,
      id,
    });
    return adminDao.deleteUser(id);
  }

  /**
   * Get all lead requests in the system with pagination.
   */
  async getLeadRequests(query: Record<string, any>) {
    global.logger.info(`Initiating getLeadRequests [SERVICE]`, {
      methodName: this.getLeadRequests.name,
      fileName: __filename,
    });
    return adminDao.getAllLeadRequests(query);
  }

  /**
   * Get all campaigns in the system with pagination.
   */
  async getCampaigns(query: Record<string, any>) {
    global.logger.info(`Initiating getCampaigns [SERVICE]`, {
      methodName: this.getCampaigns.name,
      fileName: __filename,
    });
    return adminDao.getAllCampaigns(query);
  }

  /**
   * Get high-level aggregate statistics for the admin dashboard.
   */
  async getStats() {
    global.logger.info(`Initiating getStats [SERVICE]`, {
      methodName: this.getStats.name,
      fileName: __filename,
    });
    return adminDao.getStats();
  }
}

export const adminService = new AdminService();
export default adminService;
