import { adminDao } from './Admin.dao';
import { UpdateTokensRequest } from './Admin.dto';

export class AdminService {
  async getUsers(query: Record<string, any>) { return adminDao.getAllUsers(query); }
  async getUserById(id: string) {
    const user = await adminDao.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
  async updateTokens(id: string, data: UpdateTokensRequest) {
    return adminDao.updateTokenBalance(id, data.tokenBalance);
  }
  async suspendUser(id: string, suspend: boolean) {
    return adminDao.suspendUser(id, suspend);
  }
  async deleteUser(id: string) { return adminDao.deleteUser(id); }
  async getLeadRequests(query: Record<string, any>) { return adminDao.getAllLeadRequests(query); }
  async getCampaigns(query: Record<string, any>) { return adminDao.getAllCampaigns(query); }
  async getStats() { return adminDao.getStats(); }
}

export const adminService = new AdminService();
export default adminService;
