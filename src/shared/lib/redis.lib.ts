import { logger } from '@/logger/logger';
import { Redis } from '@upstash/redis'; // Importing Upstash Redis client

const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

const redis = REDIS_URL ? new Redis({ 
  url: REDIS_URL,
  token: REDIS_TOKEN
}) : null;

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
    if (!redis) {
      logger.warn(`[redis] Cannot get key: ${key} — REDIS_URL not set`);
      return null;
    }
    try {
      const value = await redis.get<string>(key);
      logger.info(`[redis] Retrieved key: ${key}`);
      if (!value) {
        throw new Error('Key not found');
      } else {
        return value;
      }
    } catch (error) {
      logger.error(`[redis] Failed to get key: ${key}`, { variables: { error: (error as Error).message } });
      return null;
    }
  }

  async set(key: string, value: string, _ttlSeconds?: number): Promise<void> {
    if (!redis) {
      logger.warn(`[redis] Cannot set key: ${key} — REDIS_URL not set`);
      return;
    }
    try {
      if (_ttlSeconds) {
        await redis.set(key, value, { ex: _ttlSeconds });
      } else {
        await redis.set(key, value);
      }
      logger.info(`[redis] Set key: ${key} with TTL: ${_ttlSeconds || 'none'}`);
    } catch (error) {
      logger.error(`[redis] Failed to set key: ${key}`, { variables: { error: (error as Error).message } });
    }
  }

  async del(key: string): Promise<void> {
    if (!redis) {
      logger.warn(`[redis] Cannot delete key: ${key} — REDIS_URL not set`);
      return;
    }
    try {
      await redis.del(key);
      logger.info(`[redis] Deleted key: ${key}`);
    } catch (error) {
      logger.error(`[redis] Failed to delete key: ${key}`, { variables: { error: (error as Error).message } });
    }
  }
}

export const redisObj = RedisClient.getInstance();
export default redisObj;
