// Data Access Object for leads
import { leadsDao } from './Leads.dao';

// Storage and utilities
import { uploadFile, getSignedUrl } from '@/shared/lib/r2.lib';
import { sanitizeFilename } from '@/utils/sanitizeFilename';

// Data Transfer Objects
import { CreateLeadRequestByLink, CreateLeadRequestByUpload } from './Leads.dto';

/**
 * LeadsService
 *
 * @description Business logic for lead request imports (upload and link),
 * listing lead requests, and exposing underlying leads and files. Handles
 * storage coordination and enforces ownership checks before accessing data.
 */
export class LeadsService {
  /**
   * Handle CSV upload-based lead imports.
   *
   * @description Stores the uploaded file in R2, associates it with a lead
   * request record, and returns the created request. The actual parsing is
   * deferred to a background job (see TODO).
   */
  async uploadLead(userId: string, data: CreateLeadRequestByUpload, fileBuffer: Buffer, originalName: string) {
    global.logger.info('Initiating uploadLead [SERVICE]', {
      methodName: this.uploadLead.name,
      fileName: __filename,
      userId,
      listName: data.listName,
    });
    // Generate a stable, namespaced storage key for the uploaded leads file.
    const key = `leads/${userId}/${Date.now()}-${sanitizeFilename(originalName)}`;
    await uploadFile(key, fileBuffer, 'text/csv');
    const req = await leadsDao.create({ ...data, fileKey: key, userId });
    // TODO: enqueue leadParse job
    return req;
  }

  /**
   * Handle link-based lead imports.
   *
   * @description Instead of uploading a file, the client provides a URL which
   * is stored as the file key. Parsing is likewise delegated to a background
   * job.
   */
  async linkLead(userId: string, data: CreateLeadRequestByLink) {
    global.logger.info('Initiating linkLead [SERVICE]', {
      methodName: this.linkLead.name,
      fileName: __filename,
      userId,
      listName: data.listName,
    });
    const req = await leadsDao.create({ listName: data.listName, industry: data.industry, description: data.description, fileKey: data.fileUrl, userId });
    // TODO: enqueue leadParse job
    return req;
  }

  /**
   * List lead requests for a user with pagination.
   */
  async list(userId: string, query: Record<string, any>) {
    global.logger.info('Initiating list lead requests [SERVICE]', {
      methodName: this.list.name,
      fileName: __filename,
      userId,
    });
    return leadsDao.findAllByUser(userId, query);
  }

  /**
   * Get a single lead request by ID, enforcing user ownership.
   *
   * @throws Error when the request is not found or not owned by the user.
   */
  async getById(id: string, userId: string) {
    global.logger.info('Initiating getById lead request [SERVICE]', {
      methodName: this.getById.name,
      fileName: __filename,
      id,
      userId,
    });
    const req = await leadsDao.findById(id, userId);
    if (!req) throw new Error('Lead request not found');
    return req;
  }

  /**
   * Get a signed URL for downloading the original leads file.
   *
   * @throws Error when the request or file key does not exist.
   */
  async getSignedFileUrl(id: string, userId: string) {
    global.logger.info('Initiating getSignedFileUrl [SERVICE]', {
      methodName: this.getSignedFileUrl.name,
      fileName: __filename,
      id,
      userId,
    });
    const req = await leadsDao.findById(id, userId);
    if (!req || !req.fileKey) throw new Error('File not found');
    return getSignedUrl(req.fileKey);
  }

  /**
   * List parsed leads for a given lead request with pagination.
   */
  async getLeads(id: string, userId: string, query: Record<string, any>) {
    global.logger.info('Initiating getLeads [SERVICE]', {
      methodName: this.getLeads.name,
      fileName: __filename,
      id,
      userId,
    });
    const req = await leadsDao.findById(id, userId);
    if (!req) throw new Error('Lead request not found');
    return leadsDao.getLeads(id, query);
  }

  /**
   * Soft-delete a lead request for a user.
   *
   * @description Marks the request as deleted instead of removing it so that
   * historical analytics remain intact.
   */
  async softDelete(id: string, userId: string) {
    global.logger.info('Initiating softDelete lead request [SERVICE]', {
      methodName: this.softDelete.name,
      fileName: __filename,
      id,
      userId,
    });
    const req = await leadsDao.findById(id, userId);
    if (!req) throw new Error('Lead request not found');
    return leadsDao.softDelete(id, userId);
  }
}

export const leadsService = new LeadsService();
export default leadsService;
