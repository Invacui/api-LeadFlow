// Prisma client
import prisma from '@/db/prisma';

// Pagination helper
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * AdminDao
 *
 * @description Data access object for administrative views over users, lead
 * requests, campaigns, and aggregate stats. Performs raw Prisma calls while
 * applying consistent pagination behaviour.
 */
export class AdminDao {
  /**
   * Get all non-deleted users with pagination.
   */
  async getAllUsers(query: Record<string, any>) {
    global.logger.info(`Getting all users [DAO]`, {
      methodName: this.getAllUsers.name,
      fileName: __filename,
    });
    const { skip, take } = paginate(query);
    const where = { isDeleted: false };
    // Fetch list and count concurrently for better throughput on admin pages.
    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
    return [items, total] as const;
  }

  /**
   * Get a single non-deleted user by ID.
   */
  async getUserById(id: string) {
    global.logger.info(`Getting user by id [DAO]`, {
      methodName: this.getUserById.name,
      fileName: __filename,
      id,
    });
    return prisma.user.findFirst({ where: { id, isDeleted: false } });
  }

  /**
   * Set a user's token balance.
   */
  async updateTokenBalance(id: string, tokenBalance: number) {
    global.logger.info(`Updating token balance [DAO]`, {
      methodName: this.updateTokenBalance.name,
      fileName: __filename,
      id,
    });
    return prisma.user.update({ where: { id }, data: { tokenBalance } });
  }

  /**
   * Toggle the suspended flag for a user.
   */
  async suspendUser(id: string, suspend: boolean) {
    global.logger.info(`Suspend user [DAO]`, {
      methodName: this.suspendUser.name,
      fileName: __filename,
      id,
      suspend,
    });
    return prisma.user.update({ where: { id }, data: { isSuspended: suspend } });
  }

  /**
   * Soft-delete a user by marking `isDeleted` true.
   */
  async deleteUser(id: string) {
    global.logger.info(`Delete user (soft) [DAO]`, {
      methodName: this.deleteUser.name,
      fileName: __filename,
      id,
    });
    return prisma.user.update({ where: { id }, data: { isDeleted: true } });
  }

  /**
   * Get all lead requests across all users with pagination.
   */
  async getAllLeadRequests(query: Record<string, any>) {
    global.logger.info(`Getting all lead requests [DAO]`, {
      methodName: this.getAllLeadRequests.name,
      fileName: __filename,
    });
    const { skip, take } = paginate(query);
    const [items, total] = await Promise.all([
      prisma.leadRequest.findMany({ skip, take, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, email: true, name: true } } } }),
      prisma.leadRequest.count(),
    ]);
    return [items, total] as const;
  }

  /**
   * Get all campaigns across all users with pagination.
   */
  async getAllCampaigns(query: Record<string, any>) {
    global.logger.info(`Getting all campaigns [DAO]`, {
      methodName: this.getAllCampaigns.name,
      fileName: __filename,
    });
    const { skip, take } = paginate(query);
    const [items, total] = await Promise.all([
      prisma.campaign.findMany({ skip, take, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, email: true, name: true } } } }),
      prisma.campaign.count(),
    ]);
    return [items, total] as const;
  }

  /**
   * Get aggregate statistics for users, lead requests, campaigns, and leads.
   */
  async getStats() {
    global.logger.info(`Getting stats [DAO]`, {
      methodName: this.getStats.name,
      fileName: __filename,
    });
    const [totalUsers, totalLeadRequests, totalCampaigns, totalLeads] = await Promise.all([
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.leadRequest.count(),
      prisma.campaign.count(),
      prisma.lead.count(),
    ]);
    return { totalUsers, totalLeadRequests, totalCampaigns, totalLeads };
  }
}

export const adminDao = new AdminDao();
export default adminDao;
