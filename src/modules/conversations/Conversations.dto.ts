import { Channel, ConversationStatus, Direction } from '@prisma/client';

export interface ReplyRequest {
  content: string;
  channel: Channel;
}
