import { logger } from "@/logger/logger";
// BullMQ engagement worker stub
import prisma from '@/db/prisma';
import { sendEmail } from '@/shared/lib/resend.lib';
import { sendWhatsApp } from '@/shared/lib/whatsapp.lib';

export const processEngagementJob = async (jobData: {
  campaignId: string;
  leadId: string;
  channel: 'EMAIL' | 'WHATSAPP';
  content: string;
  emailSubject?: string;
}) => {
  logger.info('[engagement] Processing job', { variables: { jobData } });
  try {
    const lead = await prisma.lead.findUnique({ where: { id: jobData.leadId } });
    if (!lead) throw new Error('Lead not found');

    if (jobData.channel === 'EMAIL' && lead.email) {
      await sendEmail({ to: lead.email, subject: jobData.emailSubject || 'Outreach', html: `<p>${jobData.content}</p>` });
    } else if (jobData.channel === 'WHATSAPP' && lead.phone) {
      await sendWhatsApp(lead.phone, jobData.content);
    }

    await prisma.engagementLog.create({
      data: {
        campaignId: jobData.campaignId,
        leadId: jobData.leadId,
        channel: jobData.channel,
        direction: 'OUTBOUND',
        content: jobData.content,
        status: 'SENT',
      },
    });

    await prisma.campaign.update({
      where: { id: jobData.campaignId },
      data: { sentCount: { increment: 1 } },
    });
  } catch (err) {
    logger.error('[engagement] Job failed', { variables: { err } });
  }
};
