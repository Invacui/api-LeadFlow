import { logger } from "@/logger/logger";
// BullMQ lead parse worker stub
// When bullmq is installed:
// import { Worker } from 'bullmq';
// export const leadParseWorker = new Worker('leadParse', async (job) => { ... }, { connection: ... });

import prisma from '@/db/prisma';

export const processLeadParseJob = async (jobData: { leadRequestId: string; fileKey?: string; fileUrl?: string }) => {
  logger.info('[leadParse] Processing job', { variables: { jobData } });
  try {
    await prisma.leadRequest.update({
      where: { id: jobData.leadRequestId },
      data: { status: 'PROCESSING' },
    });
    // TODO: Parse CSV/XLSX from R2 or external URL, create Lead records
    logger.info('[leadParse] Job completed (stub)', { variables: { leadRequestId: jobData.leadRequestId } });
  } catch (err) {
    logger.error('[leadParse] Job failed', { variables: { err } });
    await prisma.leadRequest.update({
      where: { id: jobData.leadRequestId },
      data: { status: 'FAILED' },
    });
  }
};
