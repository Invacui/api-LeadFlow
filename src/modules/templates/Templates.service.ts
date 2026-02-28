// Data Access Object for templates
import { templatesDao } from './Templates.dao';

// LLM template generator
import { generateTemplate } from '@/shared/lib/groq.lib';

// Data Transfer Objects
import { CreateTemplateRequest, UpdateTemplateRequest, LaunchCampaignRequest } from './Templates.dto';

// Prisma client
import prisma from '@/db/prisma';

/**
 * TemplatesService
 *
 * @description Encapsulates business logic for managing templates and campaigns
 * derived from them. Responsible for enforcing invariants (e.g. only DRAFT
 * templates are editable) and orchestrating external services such as the LLM
 * template generator and Prisma.
 */
export class TemplatesService {
  /**
   * Create a new template owned by the given user.
   *
   * @param userId ID of the authenticated user.
   * @param data   Template payload from the client.
   */
  async create(userId: string, data: CreateTemplateRequest) {
    global.logger.info(`Initiating create template [SERVICE]`, {
      methodName: this.create.name,
      fileName: __filename,
      userId,
    });
    return templatesDao.create({ ...data, userId });
  }

  /**
   * List templates for a user with pagination.
   *
   * @param userId ID of the authenticated user.
   * @param query  Raw query params used for pagination and filtering.
   */
  async list(userId: string, query: Record<string, any>) {
    global.logger.info(`Initiating list templates [SERVICE]`, {
      methodName: this.list.name,
      fileName: __filename,
      userId,
    });
    return templatesDao.findAllByUser(userId, query);
  }

  /**
   * Get a template by ID, ensuring it belongs to the given user.
   *
   * @throws Error when the template is not found.
   */
  async getById(id: string, userId: string) {
    global.logger.info(`Initiating getById template [SERVICE]`, {
      methodName: this.getById.name,
      fileName: __filename,
      id,
      userId,
    });
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    return tpl;
  }

  /**
   * Update a template owned by the given user.
   *
   * @description Only templates in `DRAFT` status are editable. Attempts to edit
   * published templates will result in an error.
   */
  async update(id: string, userId: string, data: UpdateTemplateRequest) {
    global.logger.info(`Initiating update template [SERVICE]`, {
      methodName: this.update.name,
      fileName: __filename,
      id,
      userId,
    });
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    // Guardrail: once a template is live, prevent edits that could desync analytics.
    if (tpl.status !== 'DRAFT') throw new Error('Only DRAFT templates can be edited');
    return templatesDao.update(id, data);
  }

  /**
   * Delete a template owned by the given user.
   *
   * @throws Error when the template does not exist or is not owned by the user.
   */
  async delete(id: string, userId: string) {
    global.logger.info(`Initiating delete template [SERVICE]`, {
      methodName: this.delete.name,
      fileName: __filename,
      id,
      userId,
    });
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    return templatesDao.delete(id);
  }

  /**
   * Generate and persist a preview for a template.
   *
   * @description Uses the LLM-backed `generateTemplate` helper to generate
   * example email and WhatsApp content, then stores the samples on the template
   * record for future reuse.
   */
  async preview(id: string, userId: string) {
    global.logger.info(`Initiating preview template [SERVICE]`, {
      methodName: this.preview.name,
      fileName: __filename,
      id,
      userId,
    });
    const tpl = await templatesDao.findById(id, userId);
    if (!tpl) throw new Error('Template not found');
    // Build prompt from template fields and call the LLM-backed generator.
    const result = await generateTemplate(
      tpl.productName,
      tpl.description,
      tpl.targetAudience || '',
      tpl.tone,
      tpl.cta || ''
    );
    // Persist the generated samples so subsequent previews can be returned fast.
    await templatesDao.update(id, {
      sampleEmailSubject: result.emailSubject,
      sampleEmailBody: result.emailBody,
      sampleWhatsApp: result.whatsApp,
    });
    return result;
  }

  /**
   * Launch a campaign from an existing template.
   *
   * @description Marks the template as ACTIVE and creates a campaign that
   * targets one or more lead lists. This method owns the cross-entity write
   * so we can evolve the workflow in one place.
   */
  async launch(id: string, userId: string, data: LaunchCampaignRequest) {
    global.logger.info(`Initiating launch campaign [SERVICE]`, {
      methodName: this.launch.name,
      fileName: __filename,
      id,
      userId,
    });
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
