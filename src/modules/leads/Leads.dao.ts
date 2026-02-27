import { LeadRequest, Lead } from '@prisma/client';
import prisma from '@/db/prisma';
import { paginate } from '@/shared/helpers/paginate.helper';

export class LeadsDao {
  async create(data: {
    listName: string;
    industry: any;
    description?: string;
    fileKey?: string;
    userId: string;
  }): Promise<LeadRequest> {
    return prisma.leadRequest.create({ data });
  }

  async findAllByUser(userId: string, query: Record<string, any>): Promise<[LeadRequest[], number]> {
    const { skip, take } = paginate(query);
    const where = { userId, isDeleted: false };
    const [items, total] = await Promise.all([
      prisma.leadRequest.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.leadRequest.count({ where }),
    ]);
    return [items, total];
  }

  async findById(id: string, userId: string): Promise<LeadRequest | null> {
    return prisma.leadRequest.findFirst({ where: { id, userId, isDeleted: false } });
  }

  async softDelete(id: string, userId: string): Promise<LeadRequest | null> {
    return prisma.leadRequest.update({ where: { id }, data: { isDeleted: true } });
  }

  async update(id: string, data: Partial<LeadRequest>): Promise<LeadRequest> {
    return prisma.leadRequest.update({ where: { id }, data });
  }

  async getLeads(leadRequestId: string, query: Record<string, any>): Promise<[Lead[], number]> {
    const { skip, take } = paginate(query);
    const where = { leadRequestId };
    const [items, total] = await Promise.all([
      prisma.lead.findMany({ where, skip, take }),
      prisma.lead.count({ where }),
    ]);
    return [items, total];
  }
}

export const leadsDao = new LeadsDao();
export default leadsDao;
