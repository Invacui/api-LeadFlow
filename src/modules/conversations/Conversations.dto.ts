import { Channel } from '@prisma/client';

export interface ReplyRequest {
  content: string;
  channel: Channel;
}
