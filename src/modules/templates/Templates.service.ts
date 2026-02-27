import { templatesDao } from './Templates.dao';
import { generateTemplate } from '@/shared/lib/groq.lib';
import { CreateTemplateRequest, UpdateTemplateRequest, LaunchCampaignRequest } from './Templates.dto';
import prisma from '@/db/prisma';

export class TemplatesService {
  async create(userId: string, data: CreateTemplateRequest) {
    return templatesDao.create({ ...data, userId });
  }

  async list(userId: string, query: Record<string, any>) {
    return templatesDao.findAllByUser(userId, query);
  }

  async getById(id: string, userId: string) {
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    return tpl;
  }

  async update(id: string, userId: string, data: UpdateTemplateRequest) {
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    if (tpl.status !== 'DRAFT') throw new Error('Only DRAFT templates can be edited');
    return templatesDao.update(id, data);
  }

  async delete(id: string, userId: string) {
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    return templatesDao.delete(id);
  }

  async preview(id: string, userId: string) {
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    const result = await generateTemplate(
      tpl.productName,
      tpl.description,
      tpl.targetAudience || '',
      tpl.tone,
      tpl.cta || ''
    );
    await templatesDao.update(id, {
      sampleEmailSubject: result.emailSubject,
      sampleEmailBody: result.emailBody,
      sampleWhatsApp: result.whatsApp,
    });
    return result;
  }

  async launch(id: string, userId: string, data: LaunchCampaignRequest) {
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    await templatesDao.update(id, { status: 'ACTIVE' });
    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        userId,
        templateId: id,
        leadLists: {
          create: data.leadListIds.map(leadRequestId => ({ leadRequestId })),
        },
      },
    });
    return campaign;
  }
}

export const templatesService = new TemplatesService();
export default templatesService;
