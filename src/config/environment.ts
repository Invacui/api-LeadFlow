import dotenv from 'dotenv';
import path from 'path';
import { EnvironmentVariables } from '@/types';

/**
 * Environment Configuration Loader
 * Dynamically loads the appropriate environment file based on NODE_ENV
 */
class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config!: EnvironmentVariables;

  private constructor() {
    this.loadEnvironment();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  /**
   * Load environment variables based on NODE_ENV
   */
  private loadEnvironment(): void {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFile = this.getEnvironmentFile(nodeEnv);

    console.log(`🔧 Loading environment: ${nodeEnv}`);
    console.log(`📁 Environment file: ${envFile}`);

    // Load the appropriate environment file
    const result = dotenv.config({
      path: path.resolve(process.cwd(), envFile),
      override: true, // Override existing environment variables
    });

    if (result.error) {
      console.warn(
        `⚠️  Warning: Could not load ${envFile}:`,
        result.error.message
      );
      console.log(
        '📝 Using default environment variables or system environment variables'
      );
    } else {
      console.log(`✅ Successfully loaded environment from ${envFile}`);
    }

    // Validate required environment variables
    this.validateEnvironment();

    // Build configuration object
    this.config = this.buildConfig();
  }

  /**
   * Get the appropriate environment file based on NODE_ENV
   */
  private getEnvironmentFile(nodeEnv: string): string {
    const envFiles = {
      development: 'environment/private.dev.env',
      production: 'environment/private.prod.env',
      test: 'environment/private.test.env',
      staging: 'environment/private.staging.env',
    };

    return envFiles[nodeEnv as keyof typeof envFiles] || envFiles.development;
  }

  /**
   * Validate required environment variables
   */
  private validateEnvironment(): void {
    const requiredVars = [
      'NODE_ENV',
      'PORT',
      'MONGO_URI',
      'DB_NAME',
      'PRIVATE_TOKEN_KEY',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }

  /**
   * Build configuration object from environment variables
   */
  private buildConfig(): EnvironmentVariables {
    return {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: parseInt(process.env.PORT || '3001', 10),
      BASE_URL: process.env.BASE_URL || 'http://localhost',
      MONGO_URI: process.env.MONGO_URI || '',
      DB_NAME: process.env.DB_NAME || '',
      PRIVATE_TOKEN_KEY: process.env.PRIVATE_TOKEN_KEY || '',
    };
  }

  /**
   * Get configuration object
   */
  public getConfig(): EnvironmentVariables {
    return this.config;
  }

  /**
   * Get a specific environment variable
   */
  public get(key: keyof EnvironmentVariables): string | number {
    return this.config[key];
  }

  /**
   * Get all environment variables
   */
  public getAll(): Record<string, string | undefined> {
    return process.env;
  }

  /**
   * Check if running in development
   */
  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  /**
   * Check if running in production
   */
  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  /**
   * Check if running in test
   */
  public isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  /**
   * Get database configuration
   */
  public getDatabaseConfig() {
    return {
      uri: this.config.MONGO_URI,
      name: this.config.DB_NAME,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    };
  }

  /**
   * Get server configuration
   */
  public getServerConfig() {
    return {
      port: this.config.PORT,
      baseUrl: this.config.BASE_URL,
      environment: this.config.NODE_ENV,
    };
  }

  /**
   * Get JWT configuration
   */
  public getJWTConfig() {
    return {
      secret: this.config.PRIVATE_TOKEN_KEY,
      expiresIn: process.env.JWT_EXPIRY || '1h',
      algorithm: 'HS256' as const,
    };
  }

  /**
   * Get logging configuration
   */
  public getLoggingConfig() {
    return {
      level: process.env.LOG_LEVEL || (this.isDevelopment() ? 'debug' : 'warn'),
      maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
      maxFiles: process.env.LOG_FILE_MAX_FILES || '14d',
    };
  }

  /**
   * Get CORS configuration
   */
  public getCORSConfig() {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];

    return {
      origin: this.isProduction() ? allowedOrigins : '*',
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    };
  }
}

// Export singleton instance
export const envConfig = EnvironmentConfig.getInstance();
export default envConfig;
