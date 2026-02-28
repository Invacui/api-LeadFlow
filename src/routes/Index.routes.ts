import { Router, Request, Response, NextFunction } from 'express';
import authRouter from '@/modules/auth/Auth.router';
import leadsRouter from '@/modules/leads/Leads.router';
import templatesRouter from '@/modules/templates/Templates.router';
import campaignsRouter from '@/modules/campaigns/Campaigns.router';
import conversationsRouter from '@/modules/conversations/Conversations.router';
import webhooksRouter from '@/modules/webhooks/Webhooks.router';
import adminRouter from '@/modules/admin/Admin.router';
import prisma from '@/db/prisma';
import { success, error } from '@/shared/helpers/response.helper';

const router = Router();

/**
 * /health
 * 
 * @description Health check endpoint to verify server is running and responsive. Returns basic status info.
 * @route GET /health
 * @access Public
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() },
  });
});


/**
 * Middleware to authenticate internal service requests.
 *
 * @description Checks for a valid service key in the request headers to allow access to internal endpoints. Rejects unauthorized requests with a 401 error. 
 * @param req 
 * @param res 
 * @param next 
 * @returns void
 * @todo Read and add a ref for this internal auth
 */
const internalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const key = req.headers['x-service-key'];
  if (key !== process.env.INTERNAL_SERVICE_KEY) {
    error(res, 401, 'Invalid service key');
    return;
  }
  next();
};

/**
 * POST /internal/leads/parsed
 * 
 * @description Internal callback endpoint for lead parsing results. Updates the lead request status and stores parsed leads in the database. Expects leadRequestId, leads array, totalCount, and dupCount in the request body.
 */
router.post('/internal/leads/parsed', internalAuth, async (req: Request, res: Response) => {
  try {
    const { leadRequestId, leads, totalCount, dupCount } = req.body;
    await prisma.leadRequest.update({
      where: { id: leadRequestId },
      data: { status: 'DONE', totalCount: totalCount || 0, dupCount: dupCount || 0 },
    });
    if (leads?.length) {
      await prisma.lead.createMany({ data: leads.map((l: any) => ({ ...l, leadRequestId })) });
    }
    success(res, { updated: true });
  } catch (err: any) {
    logger.error('[internal] leads/parsed error', { variables: { error: err.message } });
    error(res, 500, 'Internal error processing callback');
  }
});

/**
 * POST /internal/leads/failed
 * 
 * @description Internal callback endpoint for lead parsing failures. Updates the lead request status to 'FAILED' in the database. Expects leadRequestId in the request body.
 */
router.post('/internal/leads/failed', internalAuth, async (req: Request, res: Response) => {
  try {
    const { leadRequestId } = req.body;
    await prisma.leadRequest.update({
      where: { id: leadRequestId },
      data: { status: 'FAILED' },
    });
    success(res, { updated: true });
  } catch (err: any) {
    logger.error('[internal] leads/failed error', { variables: { error: err.message } });
    error(res, 500, 'Internal error processing callback');
  }
});

// Module routes

/**
 * /auth
 * 
 * @description Routes for user authentication and management, including signup, login, token refresh, logout, email verification, password reset, and user info retrieval. Protected by rate limiting and authentication middleware where applicable.
 */
router.use('/auth', authRouter);

/**
 * /leads
 * 
 * @description Routes for managing leads, including creating lead requests, retrieving leads, and updating lead information. Protected by authentication middleware to ensure only authorized users can access lead data.
 */
router.use('/leads', leadsRouter);

/**
 * /templates
 * 
 * @description Routes for managing message templates, including creating, retrieving, updating, and deleting templates. Protected by authentication middleware to ensure only authorized users can manage templates.
 */
router.use('/templates', templatesRouter);

/**
 * /campaigns
 * 
 * @description Routes for managing marketing campaigns, including creating, retrieving, updating, and deleting campaigns. Protected by authentication middleware to ensure only authorized users can manage campaigns.
 */
router.use('/campaigns', campaignsRouter);

/**
 * /conversations
 * 
 * @description Routes for managing conversations with leads, including sending messages, retrieving conversation history, and updating conversation status. Protected by authentication middleware to ensure only authorized users can manage conversations.
 */
router.use('/conversations', conversationsRouter);

/**
 * /webhooks
 * 
 * @description Routes for managing webhooks, including creating, retrieving, updating, and deleting webhook configurations. Protected by authentication middleware to ensure only authorized users can manage webhooks.
 */
router.use('/webhooks', webhooksRouter);

/**
 * /admin
 * 
 * @description Routes for managing administrative tasks, including user management, system settings, and monitoring. Protected by authentication middleware to ensure only authorized users can access admin features.
 */
router.use('/admin', adminRouter);

export default router;
