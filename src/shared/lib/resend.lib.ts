import { logger } from "@/logger/logger";
// Resend stub — enable by installing resend
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@leadflow.io';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * sendEmail 
 * 
 * @description Send an email using Resend API. If RESEND_API_KEY is not set, it will log a warning and return a stub response.
 * 
 * @todo Add templates and store those template in db with custom design.
 * @param options 
 * @returns 
 */
export const sendEmail = async (options: SendEmailOptions): Promise<{ id: string }> => {
  if (!RESEND_API_KEY) {
    logger.warn('[resend] RESEND_API_KEY not set — email stub');
    return { id: 'stub-email-id' };
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: options.from || EMAIL_FROM, to: options.to, subject: options.subject, html: options.html }),
    });
    const data = await response.json() as any;
    return { id: data.id || 'unknown' };
  } catch (err) {
    logger.error('[resend] sendEmail error', { variables: { err } });
    throw err;
  }
};
