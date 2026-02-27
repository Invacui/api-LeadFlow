import { logger } from "@/logger/logger";
// Cloudflare R2 stub — enable by installing @aws-sdk/client-s3
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET = process.env.R2_BUCKET || 'leadflow';

export const uploadFile = async (key: string, body: Buffer | string, contentType = 'application/octet-stream'): Promise<string> => {
  if (!R2_ENDPOINT) {
    logger.warn('[r2] R2_ENDPOINT not set — upload stub');
    return `stub://${R2_BUCKET}/${key}`;
  }
  logger.info('[r2] uploadFile stub', { variables: { key, contentType } });
  return key;
};

export const getSignedUrl = async (key: string, _expiresIn = 3600): Promise<string> => {
  if (!R2_ENDPOINT) {
    return `https://stub-r2.example.com/${R2_BUCKET}/${key}?stub=true`;
  }
  return `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
};
