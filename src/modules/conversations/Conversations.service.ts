// Data Access Object for conversations
import { conversationsDao } from './Conversations.dao';

// Email and WhatsApp sending
import { sendEmail } from '@/shared/lib/resend.lib';
import { sendWhatsApp } from '@/shared/lib/whatsapp.lib';

// Data Transfer Objects
import { ReplyRequest } from './Conversations.dto';

/**
 * ConversationsService
 *
 * @description Business layer for listing conversations, loading individual
 * threads, and sending replies over email or WhatsApp. Ensures conversations
 * exist and are owned by the user before performing operations.
 */
export class ConversationsService {
  /**
   * List conversations for a user with pagination.
   */
  async list(userId: string, query: Record<string, any>) {
    global.logger.info('Initiating list conversations [SERVICE]', {
      methodName: this.list.name,
      fileName: __filename,
      userId,
    });
    return conversationsDao.findAllByUser(userId, query);
  }

  /**
   * Get a single conversation by ID, enforcing ownership.
   *
   * @throws Error when the conversation is not found.
   */
  async getById(id: string, userId: string) {
    global.logger.info('Initiating getById conversation [SERVICE]', {
      methodName: this.getById.name,
      fileName: __filename,
      id,
      userId,
    });
    const conv = await conversationsDao.findById(id, userId);
    if (!conv) throw new Error('Conversation not found');
    return conv;
  }

  /**
   * Send a reply in the context of a conversation.
   *
   * @description Sends the message over the requested channel (email or
   * WhatsApp) when the lead has a corresponding contact method, then persists
   * the outbound message to the conversation.
   */
  async reply(id: string, userId: string, data: ReplyRequest) {
    global.logger.info('Initiating reply to conversation [SERVICE]', {
      methodName: this.reply.name,
      fileName: __filename,
      id,
      userId,
      channel: data.channel,
    });
    const conv = await conversationsDao.findById(id, userId);
    if (!conv) throw new Error('Conversation not found');

    const lead = (conv as any).lead;
    // Route reply through the appropriate channel based on the requested type.
    if (data.channel === 'EMAIL' && lead?.email) {
      await sendEmail({ to: lead.email, subject: 'Re: Your inquiry', html: `<p>${data.content}</p>` });
    } else if (data.channel === 'WHATSAPP' && lead?.phone) {
      await sendWhatsApp(lead.phone, data.content);
    }

    const message = await conversationsDao.addMessage(id, data.content, 'OUTBOUND', false);
    return message;
  }
}

export const conversationsService = new ConversationsService();
export default conversationsService;
