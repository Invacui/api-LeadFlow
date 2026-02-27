import { Campaign } from '@prisma/client';
import prisma from '@/db/prisma';
import { paginate } from '@/shared/helpers/paginate.helper';

export class CampaignsDao {
  async findAllByUser(userId: string, query: Record<string, any>): Promise<[Campaign[], number]> {
    const { skip, take } = paginate(query);
    const where = { userId };
    const [items, total] = await Promise.all([
      prisma.campaign.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.campaign.count({ where }),
    ]);
    return [items, total];
  }

  async findById(id: string, userId: string): Promise<Campaign | null> {
    return prisma.campaign.findFirst({ where: { id, userId } });
  }

  async update(id: string, data: Partial<Campaign>): Promise<Campaign> {
    return prisma.campaign.update({ where: { id }, data });
  }

  async getLogs(campaignId: string, query: Record<string, any>) {
    const { skip, take } = paginate(query);
    const where = { campaignId };
    const [items, total] = await Promise.all([
      prisma.engagementLog.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.engagementLog.count({ where }),
    ]);
    return [items, total];
  }

  async getHotLeads(campaignId: string, query: Record<string, any>) {
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
