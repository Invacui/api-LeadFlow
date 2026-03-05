import { logger } from '@/logger/logger';
import { GroqMessage } from '@/shared/lib/groq.lib';
// BullMQ AI reply worker stub
import prisma from '@/db/prisma';
import { generateReply } from '@/shared/lib/groq.lib';
import { sendEmail } from '@/shared/lib/resend.lib';
import { sendWhatsApp } from '@/shared/lib/whatsapp.lib';
import { createBookingLink } from '@/shared/lib/calcom.lib';

export const processAiReplyJob = async (jobData: {
  conversationId: string;
  inboundMessage: string;
}) => {
  logger.info('[aiReply] Processing job', { variables: { jobData } });
  try {
    const conv = await prisma.conversation.findUnique({
      where: { id: jobData.conversationId },
      include: { lead: true, messages: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!conv) throw new Error('Conversation not found');

    const history: GroqMessage[] = (conv.messages as any[]).reverse().map((m: any) => ({
      role: (m.direction === 'OUTBOUND' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: m.content,
    }));
    history.push({ role: 'user', content: jobData.inboundMessage });

    const aiReply = await generateReply(history);
    if (!aiReply) return;

    const lead = conv.lead as any;
    if (conv.channel === 'EMAIL' && lead?.email) {
      await sendEmail({ to: lead.email, subject: 'Re: Your inquiry', html: `<p>${aiReply}</p>` });
    } else if (conv.channel === 'WHATSAPP' && lead?.phone) {
      await sendWhatsApp(lead.phone, aiReply);
    }

    await prisma.message.create({
      data: { conversationId: conv.id, content: aiReply, direction: 'OUTBOUND', isAiGenerated: true },
    });

    if (aiReply.toLowerCase().includes('schedule') || aiReply.toLowerCase().includes('book')) {
      const link = await createBookingLink(lead?.firstName || '', lead?.email || '');
      await prisma.conversation.update({ where: { id: conv.id }, data: { status: 'HOT', meetingLink: link } });
    }
  } catch (err) {
    logger.error('[aiReply] Job failed', { variables: { err } });
  }
};
