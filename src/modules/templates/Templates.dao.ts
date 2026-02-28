// Prisma types
import { Template } from '@prisma/client';

// Prisma client
import prisma from '@/db/prisma';

// Pagination helper
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * TemplatesDao
 *
 * @description Data access object for template persistence. Handles all direct
 * Prisma calls related to templates and applies consistent pagination and
 * scoping rules.
 */
export class TemplatesDao {
  /**
   * Create a new template record.
   *
   * @param data Template fields plus the owning `userId`.
   */
  async create(data: { productName: string; description: string; targetAudience?: string; tone?: any; cta?: string; userId: string }): Promise<Template> {
    global.logger.info(`Creating template [DAO]`, {
      methodName: this.create.name,
      fileName: __filename,
      userId: data.userId,
    });
    return prisma.template.create({ data });
  }

  /**
   * Find all templates for a given user with pagination.
   *
   * @description Uses `paginate` to compute `skip`/`take` and executes the list
   * and count queries in parallel for better performance.
   */
  async findAllByUser(userId: string, query: Record<string, any>): Promise<[Template[], number]> {
    global.logger.info(`Finding all templates by user [DAO]`, {
      methodName: this.findAllByUser.name,
      fileName: __filename,
      userId,
    });
    const { skip, take } = paginate(query);
    const where = { userId };
    // Run list and count queries concurrently to keep response times low.
    const [items, total] = await Promise.all([
      prisma.template.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.template.count({ where }),
    ]);
    return [items, total];
  }

  /**
   * Find a template by ID, scoping by user ownership.
   */
  async findById(id: string, userId: string): Promise<Template | null> {
    global.logger.info(`Finding template by id [DAO]`, {
      methodName: this.findById.name,
      fileName: __filename,
      id,
      userId,
    });
    return prisma.template.findFirst({ where: { id, userId } });
  }

  /**
   * Partially update a template by ID.
   */
  async update(id: string, data: Partial<Template>): Promise<Template> {
    global.logger.info(`Updating template [DAO]`, {
      methodName: this.update.name,
      fileName: __filename,
      id,
    });
    return prisma.template.update({ where: { id }, data });
  }

  /**
   * Hard-delete a template by ID.
   */
  async delete(id: string): Promise<Template> {
    global.logger.info(`Deleting template [DAO]`, {
      methodName: this.delete.name,
      fileName: __filename,
      id,
    });
    return prisma.template.delete({ where: { id } });
  }
}

export const templatesDao = new TemplatesDao();
export default templatesDao;
