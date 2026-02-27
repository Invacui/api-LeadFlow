export interface EmailReplyWebhook {
  from: string;
  subject?: string;
  text?: string;
  html?: string;
}

export interface WaReplyWebhook {
  object: string;
  entry: any[];
}
