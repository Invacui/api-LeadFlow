import { logger } from "@/logger/logger";
// BullMQ queue definitions — stub (install bullmq to enable)
// When bullmq is installed, replace with:
// import { Queue } from 'bullmq';
// export const leadParseQueue = new Queue('leadParse', { connection: { url: process.env.REDIS_URL } });

export interface QueueJob {
  name: string;
  data: Record<string, any>;
}

class StubQueue {
  constructor(public readonly name: string) {}

  async add(jobName: string, data: Record<string, any>): Promise<void> {
    logger.info(`[queue:${this.name}] Added job: ${jobName}`, { variables: { data } });
  }
}

export const leadParseQueue = new StubQueue('leadParse');
export const engagementQueue = new StubQueue('engagement');
export const aiReplyQueue = new StubQueue('aiReply');
