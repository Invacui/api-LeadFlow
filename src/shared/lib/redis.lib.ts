import { logger } from "@/logger/logger";
// Upstash Redis connection singleton stub — enable by installing @upstash/redis
const REDIS_URL = process.env.REDIS_URL;

class RedisClient {
  private static instance: RedisClient;

  private constructor() {
    if (REDIS_URL) {
      logger.info('[redis] Redis URL configured');
    } else {
      logger.warn('[redis] REDIS_URL not set — using in-memory stub');
    }
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  async get(key: string): Promise<string | null> {
    if (!REDIS_URL) return null;
    return null; // stub
  }

  async set(key: string, value: string, _ttlSeconds?: number): Promise<void> {
    if (!REDIS_URL) return;
  }

  async del(key: string): Promise<void> {
    if (!REDIS_URL) return;
  }
}

export const redis = RedisClient.getInstance();
export default redis;
