import dotenv from 'dotenv';
import path from 'path';
import { EnvironmentVariables } from '@/types';

class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config!: EnvironmentVariables;

  private constructor() {
    this.loadEnvironment();
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  private loadEnvironment(): void {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFile = this.getEnvironmentFile(nodeEnv);
    const result = dotenv.config({ path: path.resolve(process.cwd(), envFile), override: true });
    if (result.error) {
      console.warn(`⚠️  Warning: Could not load ${envFile}:`, result.error.message);
    } else {
      console.log(`✅ Loaded environment from ${envFile}`);
    }
    this.config = this.buildConfig();
  }

  private getEnvironmentFile(nodeEnv: string): string {
    const envFiles: Record<string, string> = {
      development: 'environment/private.dev.env',
      production: 'environment/private.prod.env',
      test: 'environment/private.test.env',
      staging: 'environment/private.staging.env',
    };
    return envFiles[nodeEnv] || envFiles.development;
  }

  private buildConfig(): EnvironmentVariables {
    return {
      NODE_ENV: process.env.NODE_ENV || 'development', // Default to 'development' if NODE_ENV is not set
      PORT: parseInt(process.env.PORT || '3001', 10), // Default to 3001 if PORT is not set
      BASE_URL: process.env.BASE_URL || 'http://localhost', // Default to 'http://localhost' if BASE_URL is not set
      DATABASE_URL: process.env.DATABASE_URL, // URL for relational databases (e.g., PostgreSQL, MySQL)
      MONGO_URI: process.env.MONGO_URI, // URL for MongoDB
      DB_NAME: process.env.DB_NAME, // Database name for MongoDB
      PRIVATE_TOKEN_KEY: process.env.PRIVATE_TOKEN_KEY, // Secret key for JWT signing
    };
  }

  public getConfig(): EnvironmentVariables {
    return this.config;
  }

  public get(key: keyof EnvironmentVariables): string | number | undefined {
    return this.config[key];
  }

  public getAll(): Record<string, string | undefined> {
    return process.env;
  }

  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  public isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  public getDatabaseConfig() {
    return {
      uri: this.config.DATABASE_URL || this.config.MONGO_URI || '',
      name: this.config.DB_NAME || '',
    };
  }

  public getServerConfig() {
    return {
      port: this.config.PORT,
      baseUrl: this.config.BASE_URL,
      environment: this.config.NODE_ENV,
    };
  }

  public getJWTConfig() {
    return {
      accessSecret: process.env.JWT_ACCESS_SECRET || this.config.PRIVATE_TOKEN_KEY || '',
      refreshSecret: process.env.JWT_REFRESH_SECRET || this.config.PRIVATE_TOKEN_KEY || '',
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    };
  }

  public getLoggingConfig() {
    return {
      level: process.env.LOG_LEVEL || (this.isDevelopment() ? 'debug' : 'warn'),
      maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
      maxFiles: process.env.LOG_FILE_MAX_FILES || '14d',
    };
  }

  public getCORSConfig() {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
    global.logger.debug('CORS configuration', {
      fileName: __filename,
      methodName: 'getCORSConfig',
      variables: { allowedOrigins, credentials: process.env.CORS_CREDENTIALS === 'true' },
    });
    return {
      origin: allowedOrigins,
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    };
  }
}

export const envConfig = EnvironmentConfig.getInstance();
export default envConfig;
