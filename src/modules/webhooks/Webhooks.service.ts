// Prisma client
import prisma from '@/db/prisma';

// LLM and messaging
import { generateReply } from '@/shared/lib/groq.lib';
import { sendEmail } from '@/shared/lib/resend.lib';
import { sendWhatsApp } from '@/shared/lib/whatsapp.lib';
import { createBookingLink } from '@/shared/lib/calcom.lib';

// Data Transfer Objects
import { EmailReplyWebhook, WaReplyWebhook } from './Webhooks.dto';

/**
 * WebhooksService
 *
 * @description Handles provider-specific webhook payloads and translates them
 * into LeadFlow domain actions such as appending messages, generating AI
 * replies, and marking conversations as hot with booking links.
 */
export class WebhooksService {
  /**
   * Handle inbound email replies from Resend.
   *
   * @description Locates the associated conversation, appends an inbound
   * message, generates an AI reply based on recent history, sends it by email,
   * and optionally marks the conversation as HOT with a booking link when the
   * reply indicates scheduling intent.
   */
  async handleEmailReply(data: EmailReplyWebhook): Promise<void> {
    global.logger.info(`Handling email reply webhook [SERVICE]`, {
      methodName: this.handleEmailReply.name,
      fileName: __filename,
      from: data.from,
    });
    const conv = await prisma.conversation.findFirst({
      where: { lead: { email: data.from } },
      include: { lead: true, messages: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    if (!conv) return;

    await prisma.message.create({
      data: { conversationId: conv.id, content: data.text || data.html || '', direction: 'INBOUND' },
    });

    // AI auto-reply
    // Build a short conversation history in the format expected by the LLM.
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
    // Very lightweight intent heuristic: treat mentions of scheduling/meeting as HOT.
    if (aiReply.toLowerCase().includes('schedule') || aiReply.toLowerCase().includes('meeting')) {
      const bookingLink = await createBookingLink(lead?.firstName || '', lead?.email || '');
      await prisma.conversation.update({ where: { id: conv.id }, data: { status: 'HOT', meetingLink: bookingLink } });
    }
  }

  /**
   * Handle inbound WhatsApp replies.
   *
   * @description Iterates through all messages in the webhook payload, locates
   * matching conversations, stores inbound messages, and optionally sends AI
   * replies over WhatsApp.
   */
  async handleWaReply(data: WaReplyWebhook): Promise<void> {
    global.logger.info(`Handling WhatsApp reply webhook [SERVICE]`, {
      methodName: this.handleWaReply.name,
      fileName: __filename,
    });
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

  /**
   * Verify the WhatsApp webhook handshake.
   *
   * @returns The challenge string when verification succeeds, otherwise null.
   */
  verifyWaWebhook(mode: string, token: string, challenge: string): string | null {
    global.logger.info(`Verifying WhatsApp webhook [SERVICE]`, {
      methodName: this.verifyWaWebhook.name,
      fileName: __filename,
      mode,
    });
    const verifyToken = process.env.META_WA_VERIFY_TOKEN;
    if (mode === 'subscribe' && token === verifyToken) return challenge;
    return null;
  }
}

export const webhooksService = new WebhooksService();
export default webhooksService;
