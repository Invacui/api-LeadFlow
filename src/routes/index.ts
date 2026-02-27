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

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() },
  });
});

// Internal service routes (protected by service key)
const internalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const key = req.headers['x-service-key'];
  if (key !== process.env.INTERNAL_SERVICE_KEY) {
    error(res, 401, 'Invalid service key');
    return;
  }
  next();
};

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
  } catch (err: any) { error(res, 500, err.message); }
});

router.post('/internal/leads/failed', internalAuth, async (req: Request, res: Response) => {
  try {
    const { leadRequestId, reason } = req.body;
    await prisma.leadRequest.update({
      where: { id: leadRequestId },
      data: { status: 'FAILED' },
    });
    success(res, { updated: true });
  } catch (err: any) { error(res, 500, err.message); }
});

// Module routes
router.use('/auth', authRouter);
router.use('/leads', leadsRouter);
router.use('/templates', templatesRouter);
router.use('/campaigns', campaignsRouter);
router.use('/conversations', conversationsRouter);
router.use('/webhooks', webhooksRouter);
router.use('/admin', adminRouter);

export default router;
