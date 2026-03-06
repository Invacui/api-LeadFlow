// Express types
import { Request, Response } from 'express';

// Webhooks service
import { webhooksService } from './Webhooks.service';

// HMAC verification and response helpers
import { verifyHmacSig } from '@/shared/helpers/hmac.helper';
import { success, error } from '@/shared/helpers/response.helper';

/**
 * WebhooksController
 *
 * @description Controller for handling inbound webhooks from email and
 * WhatsApp providers. Performs lightweight verification (e.g. HMAC checks)
 * before delegating to `WebhooksService`.
 */
export class WebhooksController {
  /**
   * Handle inbound email reply webhooks from Resend.
   *
   * @description Optionally verifies the HMAC signature when the secret is
   * configured, then forwards the payload to the service layer.
   */
  emailReply = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating emailReply webhook [CONTROLLER]', {
        methodName: 'emailReply',
        fileName: __filename,
      });
      const sig = req.headers['resend-signature'] as string;
      const secret = process.env.RESEND_WEBHOOK_SECRET;
      // When configured, verify the webhook signature to guard against spoofing.
      if (secret && sig) {
        const valid = verifyHmacSig(secret, JSON.stringify(req.body), sig);
        if (!valid) { error(res, 401, 'Invalid signature'); return; }
      }
      await webhooksService.handleEmailReply(req.body);
      success(res, { received: true });
    } catch (err: any) { error(res, 500, err.message); }
  };

  /**
   * Handle inbound WhatsApp reply webhooks.
   */
  waReply = async (req: Request, res: Response): Promise<void> => {
    try {
      global.logger.info('Initiating waReply webhook [CONTROLLER]', {
        methodName: 'waReply',
        fileName: __filename,
      });
      await webhooksService.handleWaReply(req.body);
      success(res, { received: true });
    } catch (err: any) { error(res, 500, err.message); }
  };

  /**
   * Verify the WhatsApp webhook subscription (GET callback).
   */
  waVerifyGet = (req: Request, res: Response): void => {
    global.logger.info('Initiating waVerifyGet webhook [CONTROLLER]', {
      methodName: 'waVerifyGet',
      fileName: __filename,
    });
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query as any;
    const result = webhooksService.verifyWaWebhook(mode, token, challenge);
    if (result) { res.status(200).send(result); return; }
    error(res, 403, 'Verification failed');
  };

  /**
   * Acknowledge WhatsApp webhook delivery (POST callback).
   */
  waVerifyPost = (req: Request, res: Response): void => {
    global.logger.info('Initiating waVerifyPost webhook [CONTROLLER]', {
      methodName: 'waVerifyPost',
      fileName: __filename,
    });
    success(res, { received: true });
  };
}

export default WebhooksController;
