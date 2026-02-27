import { logger } from "@/logger/logger";
// Meta WhatsApp Business API stub
const WA_PHONE_ID = process.env.META_WA_PHONE_ID;
const WA_TOKEN = process.env.META_WA_TOKEN;

export const sendWhatsApp = async (to: string, message: string): Promise<{ messageId: string }> => {
  if (!WA_PHONE_ID || !WA_TOKEN) {
    logger.warn('[whatsapp] META_WA_PHONE_ID or META_WA_TOKEN not set — stub');
    return { messageId: 'stub-wa-id' };
  }
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${WA_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WA_TOKEN}` },
      body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: message } }),
    });
    const data = await response.json() as any;
    return { messageId: data.messages?.[0]?.id || 'unknown' };
  } catch (err) {
    logger.error('[whatsapp] sendWhatsApp error', { variables: { err } });
    throw err;
  }
};
