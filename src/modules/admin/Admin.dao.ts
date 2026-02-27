import prisma from '@/db/prisma';
import { paginate } from '@/shared/helpers/paginate.helper';

export class AdminDao {
  async getAllUsers(query: Record<string, any>) {
    const { skip, take } = paginate(query);
    const where = { isDeleted: false };
    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
    return [items, total] as const;
  }

  async getUserById(id: string) {
    return prisma.user.findFirst({ where: { id, isDeleted: false } });
  }

  async updateTokenBalance(id: string, tokenBalance: number) {
    return prisma.user.update({ where: { id }, data: { tokenBalance } });
  }

  async suspendUser(id: string, suspend: boolean) {
    return prisma.user.update({ where: { id }, data: { isSuspended: suspend } });
  }

  async deleteUser(id: string) {
    return prisma.user.update({ where: { id }, data: { isDeleted: true } });
  }

  async getAllLeadRequests(query: Record<string, any>) {
    const { skip, take } = paginate(query);
    const [items, total] = await Promise.all([
      prisma.leadRequest.findMany({ skip, take, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, email: true, name: true } } } }),
      prisma.leadRequest.count(),
    ]);
    return [items, total] as const;
  }

  async getAllCampaigns(query: Record<string, any>) {
    const { skip, take } = paginate(query);
    const [items, total] = await Promise.all([
      prisma.campaign.findMany({ skip, take, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, email: true, name: true } } } }),
      prisma.campaign.count(),
    ]);
    return [items, total] as const;
  }

  async getStats() {
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
