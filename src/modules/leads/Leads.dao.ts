// Prisma types
import { LeadRequest, Lead } from '@prisma/client';

// Prisma client
import prisma from '@/db/prisma';

// Pagination helper
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * LeadsDao
 *
 * @description Data access object for lead requests and leads. Encapsulates
 * all Prisma queries, including pagination and soft-delete semantics.
 */
export class LeadsDao {
  /**
   * Create a new lead request record.
   *
   * @param data Lead request payload including owning `userId` and storage key.
   */
  async create(data: {
    listName: string;
    industry: any;
    description?: string;
    fileKey?: string;
    userId: string;
  }): Promise<LeadRequest> {
    global.logger.info(`Creating lead request [DAO]`, {
      methodName: this.create.name,
      fileName: __filename,
      userId: data.userId,
      listName: data.listName,
    });
    return prisma.leadRequest.create({ data });
  }

  /**
   * List lead requests for a user with pagination.
   */
  async findAllByUser(userId: string, query: Record<string, any>): Promise<[LeadRequest[], number]> {
    global.logger.info(`Finding all lead requests by user [DAO]`, {
      methodName: this.findAllByUser.name,
      fileName: __filename,
      userId,
    });
    const { skip, take } = paginate(query);
    const where = { userId, isDeleted: false };
    // Fetch page slice and total count concurrently.
    const [items, total] = await Promise.all([
      prisma.leadRequest.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.leadRequest.count({ where }),
    ]);
    return [items, total];
  }

  /**
   * Find a lead request by ID for a specific user, respecting soft-delete flag.
   */
  async findById(id: string, userId: string): Promise<LeadRequest | null> {
    global.logger.info(`Finding lead request by id [DAO]`, {
      methodName: this.findById.name,
      fileName: __filename,
      id,
      userId,
    });
    return prisma.leadRequest.findFirst({ where: { id, userId, isDeleted: false } });
  }

  /**
   * Soft-delete a lead request. The record remains for analytics but is hidden
   * from normal queries.
   */
  async softDelete(id: string, userId: string): Promise<LeadRequest | null> {
    global.logger.info(`Soft-deleting lead request [DAO]`, {
      methodName: this.softDelete.name,
      fileName: __filename,
      id,
      userId,
    });
    return prisma.leadRequest.update({ where: { id }, data: { isDeleted: true } });
  }

  /**
   * Partially update a lead request by ID.
   */
  async update(id: string, data: Partial<LeadRequest>): Promise<LeadRequest> {
    global.logger.info(`Updating lead request [DAO]`, {
      methodName: this.update.name,
      fileName: __filename,
      id,
    });
    return prisma.leadRequest.update({ where: { id }, data });
  }

  /**
   * Get leads belonging to a lead request with pagination.
   */
  async getLeads(leadRequestId: string, query: Record<string, any>): Promise<[Lead[], number]> {
    global.logger.info(`Getting leads for lead request [DAO]`, {
      methodName: this.getLeads.name,
      fileName: __filename,
      leadRequestId,
    });
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
