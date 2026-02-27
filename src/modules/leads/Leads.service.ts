import { leadsDao } from './Leads.dao';
import { uploadFile, getSignedUrl } from '@/shared/lib/r2.lib';
import { sanitizeFilename } from '@/utils/sanitizeFilename';
import { CreateLeadRequestByLink, CreateLeadRequestByUpload } from './Leads.dto';

export class LeadsService {
  async uploadLead(userId: string, data: CreateLeadRequestByUpload, fileBuffer: Buffer, originalName: string) {
    const key = `leads/${userId}/${Date.now()}-${sanitizeFilename(originalName)}`;
    await uploadFile(key, fileBuffer, 'text/csv');
    const req = await leadsDao.create({ ...data, fileKey: key, userId });
    // TODO: enqueue leadParse job
    return req;
  }

  async linkLead(userId: string, data: CreateLeadRequestByLink) {
    const req = await leadsDao.create({ listName: data.listName, industry: data.industry, description: data.description, fileKey: data.fileUrl, userId });
    // TODO: enqueue leadParse job
    return req;
  }

  async list(userId: string, query: Record<string, any>) {
    return leadsDao.findAllByUser(userId, query);
  }

  async getById(id: string, userId: string) {
    const req = await leadsDao.findById(id, userId);
    if (!req) throw new Error('Lead request not found');
    return req;
  }

  async getSignedFileUrl(id: string, userId: string) {
    const req = await leadsDao.findById(id, userId);
    if (!req || !req.fileKey) throw new Error('File not found');
    return getSignedUrl(req.fileKey);
  }

  async getLeads(id: string, userId: string, query: Record<string, any>) {
    const req = await leadsDao.findById(id, userId);
    if (!req) throw new Error('Lead request not found');
    return leadsDao.getLeads(id, query);
  }

  async softDelete(id: string, userId: string) {
    const req = await leadsDao.findById(id, userId);
    if (!req) throw new Error('Lead request not found');
    return leadsDao.softDelete(id, userId);
  }
}

export const leadsService = new LeadsService();
export default leadsService;
