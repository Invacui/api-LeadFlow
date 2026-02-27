import { Conversation } from '@prisma/client';
import prisma from '@/db/prisma';
import { paginate } from '@/shared/helpers/paginate.helper';

export class ConversationsDao {
  async findAllByUser(userId: string, query: Record<string, any>): Promise<[Conversation[], number]> {
    const { skip, take } = paginate(query);
    const where = { userId };
    const [items, total] = await Promise.all([
      prisma.conversation.findMany({ where, skip, take, orderBy: { updatedAt: 'desc' }, include: { lead: true } }),
      prisma.conversation.count({ where }),
    ]);
    return [items, total];
  }

  async findById(id: string, userId: string): Promise<Conversation | null> {
    return prisma.conversation.findFirst({
      where: { id, userId },
      include: { lead: true, messages: { orderBy: { createdAt: 'asc' } } },
    } as any);
  }

  async addMessage(conversationId: string, content: string, direction: any, isAiGenerated = false) {
    return prisma.message.create({
      data: { conversationId, content, direction, isAiGenerated },
    });
  }
}

export const conversationsDao = new ConversationsDao();
export default conversationsDao;
