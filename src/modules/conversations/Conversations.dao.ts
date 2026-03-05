// Prisma types
import { Conversation } from '@prisma/client';

// Prisma client
import prisma from '@/db/prisma';

// Pagination helper
import { paginate } from '@/shared/helpers/paginate.helper';

/**
 * ConversationsDao
 *
 * @description Data access object for conversations and their messages. Provides
 * helpers for listing conversations, loading a full conversation with its lead
 * and messages, and appending new messages.
 */
export class ConversationsDao {
  /**
   * List conversations for a user with pagination.
   *
   * @description Uses `paginate` to compute offsets and returns both the
   * conversations and the total count so the controller can build metadata.
   */
  async findAllByUser(userId: string, query: Record<string, any>): Promise<[Conversation[], number]> {
    global.logger.info('Finding all conversations by user [DAO]', {
      methodName: this.findAllByUser.name,
      fileName: __filename,
      userId,
    });
    const { skip, take } = paginate(query);
    const where = { userId };
    // Fetch page of conversations and total count concurrently.
    const [items, total] = await Promise.all([
      prisma.conversation.findMany({ where, skip, take, orderBy: { updatedAt: 'desc' }, include: { lead: true } }),
      prisma.conversation.count({ where }),
    ]);
    return [items, total];
  }

  /**
   * Load a conversation by ID, including its lead and ordered messages.
   *
   * @description Messages are ordered oldest → newest so downstream consumers
   * can render the thread chronologically.
   */
  async findById(id: string, userId: string): Promise<Conversation | null> {
    global.logger.info('Finding conversation by id [DAO]', {
      methodName: this.findById.name,
      fileName: __filename,
      id,
      userId,
    });
    return prisma.conversation.findFirst({
      where: { id, userId },
      include: { lead: true, messages: { orderBy: { createdAt: 'asc' } } },
    } as any);
  }

  /**
   * Append a new message to a conversation.
   *
   * @param conversationId ID of the parent conversation.
   * @param content        Message body.
   * @param direction      Direction enum (e.g. INBOUND/OUTBOUND).
   * @param isAiGenerated  Flag indicating whether the message came from AI.
   */
  async addMessage(conversationId: string, content: string, direction: any, isAiGenerated = false) {
    global.logger.info('Adding message to conversation [DAO]', {
      methodName: this.addMessage.name,
      fileName: __filename,
      conversationId,
      direction,
    });
    return prisma.message.create({
      data: { conversationId, content, direction, isAiGenerated },
    });
  }
}

export const conversationsDao = new ConversationsDao();
export default conversationsDao;
