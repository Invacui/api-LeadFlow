import { Template } from '@prisma/client';
import prisma from '@/db/prisma';
import { paginate } from '@/shared/helpers/paginate.helper';

export class TemplatesDao {
  async create(data: { productName: string; description: string; targetAudience?: string; tone?: any; cta?: string; userId: string }): Promise<Template> {
    return prisma.template.create({ data });
  }

  async findAllByUser(userId: string, query: Record<string, any>): Promise<[Template[], number]> {
    const { skip, take } = paginate(query);
    const where = { userId };
    const [items, total] = await Promise.all([
      prisma.template.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.template.count({ where }),
    ]);
    return [items, total];
  }

  async findById(id: string, userId: string): Promise<Template | null> {
    return prisma.template.findFirst({ where: { id, userId } });
  }

  async update(id: string, data: Partial<Template>): Promise<Template> {
    return prisma.template.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Template> {
    return prisma.template.delete({ where: { id } });
  }
}

export const templatesDao = new TemplatesDao();
export default templatesDao;
