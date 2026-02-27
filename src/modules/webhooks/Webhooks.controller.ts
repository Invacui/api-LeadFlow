import { Request, Response } from 'express';
import { webhooksService } from './Webhooks.service';
import { verifyHmacSig } from '@/shared/helpers/hmac.helper';
import { success, error } from '@/shared/helpers/response.helper';

export class WebhooksController {
  async emailReply(req: Request, res: Response): Promise<void> {
    try {
      const sig = req.headers['resend-signature'] as string;
      const secret = process.env.RESEND_WEBHOOK_SECRET;
      if (secret && sig) {
        const valid = verifyHmacSig(secret, JSON.stringify(req.body), sig);
        if (!valid) { error(res, 401, 'Invalid signature'); return; }
      }
      await webhooksService.handleEmailReply(req.body);
      success(res, { received: true });
    } catch (err: any) { error(res, 500, err.message); }
  }

  async waReply(req: Request, res: Response): Promise<void> {
    try {
      await webhooksService.handleWaReply(req.body);
      success(res, { received: true });
    } catch (err: any) { error(res, 500, err.message); }
  }

  waVerifyGet(req: Request, res: Response): void {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query as any;
    const result = webhooksService.verifyWaWebhook(mode, token, challenge);
    if (result) { res.status(200).send(result); return; }
    error(res, 403, 'Verification failed');
  }

  waVerifyPost(req: Request, res: Response): void {
    success(res, { received: true });
  }
}

export const webhooksController = new WebhooksController();
export default webhooksController;
