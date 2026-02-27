import { conversationsDao } from './Conversations.dao';
import { sendEmail } from '@/shared/lib/resend.lib';
import { sendWhatsApp } from '@/shared/lib/whatsapp.lib';
import { ReplyRequest } from './Conversations.dto';

export class ConversationsService {
  async list(userId: string, query: Record<string, any>) {
    return conversationsDao.findAllByUser(userId, query);
  }

  async getById(id: string, userId: string) {
    const conv = await conversationsDao.findById(id, userId);
    if (!conv) throw new Error('Conversation not found');
    return conv;
  }

  async reply(id: string, userId: string, data: ReplyRequest) {
    const conv = await conversationsDao.findById(id, userId);
    if (!conv) throw new Error('Conversation not found');

    const lead = (conv as any).lead;
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
