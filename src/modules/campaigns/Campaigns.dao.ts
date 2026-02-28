// Prisma types
import { Campaign } from '@prisma/client';

// Prisma client
import prisma from '@/db/prisma';

// Pagination helper
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * CampaignsDao
 *
 * @description Data access object for campaign entities and related reporting
 * data (engagement logs, hot leads). Centralises all Prisma access for
 * campaigns to keep services thin.
 */
export class CampaignsDao {
  /**
   * List campaigns for a user with pagination.
   */
  async findAllByUser(userId: string, query: Record<string, any>): Promise<[Campaign[], number]> {
    global.logger.info(`Finding all campaigns by user [DAO]`, {
      methodName: this.findAllByUser.name,
      fileName: __filename,
      userId,
    });
    const { skip, take } = paginate(query);
    const where = { userId };
    // Execute listing and count queries concurrently.
    const [items, total] = await Promise.all([
      prisma.campaign.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.campaign.count({ where }),
    ]);
    return [items, total];
  }

  /**
   * Find a single campaign by ID owned by the given user.
   */
  async findById(id: string, userId: string): Promise<Campaign | null> {
    global.logger.info(`Finding campaign by id [DAO]`, {
      methodName: this.findById.name,
      fileName: __filename,
      id,
      userId,
    });
    return prisma.campaign.findFirst({ where: { id, userId } });
  }

  /**
   * Partially update a campaign by ID.
   */
  async update(id: string, data: Partial<Campaign>): Promise<Campaign> {
    global.logger.info(`Updating campaign [DAO]`, {
      methodName: this.update.name,
      fileName: __filename,
      id,
    });
    return prisma.campaign.update({ where: { id }, data });
  }

  /**
   * Get paginated engagement logs for a campaign.
   *
   * @description Returns both items and total count so the caller can build a
   * paginated response.
   */
  async getLogs(campaignId: string, query: Record<string, any>) {
    global.logger.info(`Getting campaign logs [DAO]`, {
      methodName: this.getLogs.name,
      fileName: __filename,
      campaignId,
    });
    const { skip, take } = paginate(query);
    const where = { campaignId };
    // Run log listing and count queries concurrently.
    const [items, total] = await Promise.all([
      prisma.engagementLog.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.engagementLog.count({ where }),
    ]);
    return [items, total];
  }

  /**
   * Get paginated "hot leads" conversations for a campaign.
   *
   * @description A hot lead is a conversation marked as HOT that has at least
   * one engagement log associated with the given campaign.
   */
  async getHotLeads(campaignId: string, query: Record<string, any>) {
    global.logger.info(`Getting hot leads for campaign [DAO]`, {
      methodName: this.getHotLeads.name,
      fileName: __filename,
      campaignId,
    });
    const { skip, take } = paginate(query);
    const [items, total] = await Promise.all([
      prisma.conversation.findMany({
        where: { status: 'HOT', lead: { engagementLogs: { some: { campaignId } } } },
        skip,
        take,
        include: { lead: true },
      }),
      prisma.conversation.count({
        where: { status: 'HOT', lead: { engagementLogs: { some: { campaignId } } } },
      }),
    ]);
    return [items, total];
  }
}

export const campaignsDao = new CampaignsDao();
export default campaignsDao;
