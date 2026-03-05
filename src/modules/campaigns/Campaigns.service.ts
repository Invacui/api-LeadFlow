// Data Access Object for campaigns
import { campaignsDao } from './Campaigns.dao';

/**
 * CampaignsService
 *
 * @description Business layer for campaign management and reporting. Applies
 * state-based guards (e.g. only running campaigns can be paused) and delegates
 * persistence to `CampaignsDao`.
 */
export class CampaignsService {
  /**
   * List campaigns for a user with pagination.
   */
  async list(userId: string, query: Record<string, any>) {
    global.logger.info('Initiating list campaigns [SERVICE]', {
      methodName: this.list.name,
      fileName: __filename,
      userId,
    });
    return campaignsDao.findAllByUser(userId, query);
  }

  /**
   * Get a single campaign by ID, enforcing user ownership.
   *
   * @throws Error when the campaign is not found.
   */
  async getById(id: string, userId: string) {
    global.logger.info('Initiating getById campaign [SERVICE]', {
      methodName: this.getById.name,
      fileName: __filename,
      id,
      userId,
    });
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    return c;
  }

  /**
   * Pause a running campaign.
   *
   * @description Only campaigns in `RUNNING` status can be paused. This guard
   * prevents inconsistent state transitions.
   */
  async pause(id: string, userId: string) {
    global.logger.info('Initiating pause campaign [SERVICE]', {
      methodName: this.pause.name,
      fileName: __filename,
      id,
      userId,
    });
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    if (c.status !== 'RUNNING') throw new Error('Campaign is not running');
    return campaignsDao.update(id, { status: 'PAUSED' });
  }

  /**
   * Resume a paused campaign.
   *
   * @description Only campaigns in `PAUSED` status can be resumed back to
   * `RUNNING`. All other statuses are rejected.
   */
  async resume(id: string, userId: string) {
    global.logger.info('Initiating resume campaign [SERVICE]', {
      methodName: this.resume.name,
      fileName: __filename,
      id,
      userId,
    });
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    if (c.status !== 'PAUSED') throw new Error('Campaign is not paused');
    return campaignsDao.update(id, { status: 'RUNNING' });
  }

  /**
   * Get engagement logs for a campaign, after verifying ownership.
   */
  async getLogs(id: string, userId: string, query: Record<string, any>) {
    global.logger.info('Initiating getLogs campaign [SERVICE]', {
      methodName: this.getLogs.name,
      fileName: __filename,
      id,
      userId,
    });
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    return campaignsDao.getLogs(id, query);
  }

  /**
   * Get "hot leads" for a campaign, after verifying ownership.
   */
  async getHotLeads(id: string, userId: string, query: Record<string, any>) {
    global.logger.info('Initiating getHotLeads campaign [SERVICE]', {
      methodName: this.getHotLeads.name,
      fileName: __filename,
      id,
      userId,
    });
    const c = await campaignsDao.findById(id, userId);
    if (!c) throw new Error('Campaign not found');
    return campaignsDao.getHotLeads(id, query);
  }
}

export const campaignsService = new CampaignsService();
export default campaignsService;
