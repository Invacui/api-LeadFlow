import prisma from '@/db/prisma';
import { generateReply } from '@/shared/lib/groq.lib';
import { sendEmail } from '@/shared/lib/resend.lib';
import { sendWhatsApp } from '@/shared/lib/whatsapp.lib';
import { createBookingLink } from '@/shared/lib/calcom.lib';
import { EmailReplyWebhook, WaReplyWebhook } from './Webhooks.dto';

export class WebhooksService {
  async handleEmailReply(data: EmailReplyWebhook): Promise<void> {
    const conv = await prisma.conversation.findFirst({
      where: { lead: { email: data.from } },
      include: { lead: true, messages: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    if (!conv) return;

    await prisma.message.create({
      data: { conversationId: conv.id, content: data.text || data.html || '', direction: 'INBOUND' },
    });

    // AI auto-reply
    const history = (conv as any).messages.reverse().map((m: any) => ({
      role: m.direction === 'OUTBOUND' ? 'assistant' : 'user',
      content: m.content,
    }));
    history.push({ role: 'user', content: data.text || data.html || '' });

    const aiReply = await generateReply(history);
    if (!aiReply) return;

    const lead = (conv as any).lead;
    if (lead?.email) {
      await sendEmail({ to: lead.email, subject: `Re: ${data.subject || 'Your inquiry'}`, html: `<p>${aiReply}</p>` });
    }

    await prisma.message.create({
      data: { conversationId: conv.id, content: aiReply, direction: 'OUTBOUND', isAiGenerated: true },
    });

    // Check if hot lead → create booking link
    if (aiReply.toLowerCase().includes('schedule') || aiReply.toLowerCase().includes('meeting')) {
      const bookingLink = await createBookingLink(lead?.firstName || '', lead?.email || '');
      await prisma.conversation.update({ where: { id: conv.id }, data: { status: 'HOT', meetingLink: bookingLink } });
    }
  }

  async handleWaReply(data: WaReplyWebhook): Promise<void> {
    const messages = data.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages?.length) return;

    for (const msg of messages) {
      const from = msg.from;
      const text = msg.text?.body || '';

      const conv = await prisma.conversation.findFirst({
        where: { lead: { phone: from } },
        include: { lead: true },
      });
      if (!conv) continue;

      await prisma.message.create({
        data: { conversationId: conv.id, content: text, direction: 'INBOUND' },
      });

      const aiReply = await generateReply([{ role: 'user', content: text }]);
      if (!aiReply) continue;

      const lead = (conv as any).lead;
      if (lead?.phone) await sendWhatsApp(lead.phone, aiReply);

      await prisma.message.create({
        data: { conversationId: conv.id, content: aiReply, direction: 'OUTBOUND', isAiGenerated: true },
      });
    }
  }

  verifyWaWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = process.env.META_WA_VERIFY_TOKEN;
    if (mode === 'subscribe' && token === verifyToken) return challenge;
    return null;
  }
}

export const webhooksService = new WebhooksService();
export default webhooksService;
