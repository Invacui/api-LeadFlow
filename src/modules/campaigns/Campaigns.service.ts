import { campaignsDao } from './Campaigns.dao';

export class CampaignsService {
  async list(userId: string, query: Record<string, any>) {
    return campaignsDao.findAllByUser(userId, query);
  }

  async getById(id: string, userId: string) {
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    return c;
  }

  async pause(id: string, userId: string) {
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    if (c.status !== 'RUNNING') throw new Error('Campaign is not running');
    return campaignsDao.update(id, { status: 'PAUSED' });
  }

  async resume(id: string, userId: string) {
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    if (c.status !== 'PAUSED') throw new Error('Campaign is not paused');
    return campaignsDao.update(id, { status: 'RUNNING' });
  }

  async getLogs(id: string, userId: string, query: Record<string, any>) {
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    return campaignsDao.getLogs(id, query);
  }

  async getHotLeads(id: string, userId: string, query: Record<string, any>) {
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    return campaignsDao.getHotLeads(id, query);
  }
}

export const campaignsService = new CampaignsService();
export default campaignsService;
