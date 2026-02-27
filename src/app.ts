import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import envConfig from '@/config/environment';
import routes from '@/routes/Index.routes';
import ErrorHandler from '@/utils/ErrorHandler.utils';

// Extend global namespace
declare global {
  var MONGO_URI: string;
  var DB_NAME: string;
}

/**
 * @class App
 * @description Main application class that initializes Express app, middleware, and routes
 */
export class App {
  public app: Application;
  private MONGO_URI!: string;
  private DB_NAME!: string;

  constructor() {
    // Initialize environment variables
    this.loadEnvVariables();

    // Initialize Express app
    this.app = express();

    // Set up application middleware, routes, and error handling
    this.defineGlobals();
    this.registerMiddlewares();
    this.registerAppRoutes();
    this.registerErrorHandlingRoutes();

    // Log middleware registration success
    logger.info('Application initialized successfully', {
      fileName: __filename,
      methodName: 'constructor',
      variables: {
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001,
      },
    });
  }

  /**
   * @method loadEnvVariables
   * @description Load and validate environment variables
   */
  private loadEnvVariables(): void {
    // Environment is already loaded by envConfig singleton
    const config = envConfig.getConfig();

    this.MONGO_URI = config.MONGO_URI;
    this.DB_NAME = config.DB_NAME;

    logger.info('Environment variables loaded successfully', {
      fileName: __filename,
      methodName: 'loadEnvVariables',
      variables: {
        NODE_ENV: config.NODE_ENV,
        PORT: config.PORT,
        DB_NAME: this.DB_NAME,
        MONGO_URI_PROVIDED: !!this.MONGO_URI,
        environment: envConfig.isDevelopment()
          ? 'development'
          : envConfig.isProduction()
          ? 'production'
          : 'test',
      },
    });
  }

  /**
   * @method defineGlobals
   * @description Define global variables required for the application
   */
  private defineGlobals(): void {
    // Set global variables
    global.MONGO_URI = this.MONGO_URI;
    global.DB_NAME = this.DB_NAME;

    logger.info('Global variables defined', {
      fileName: __filename,
      methodName: 'defineGlobals',
      variables: {
        MONGO_URI_SET: !!global.MONGO_URI,
        DB_NAME_SET: !!global.DB_NAME,
      },
    });
  }

  /**
   * @method registerMiddlewares
   * @description Register necessary middlewares
   */
  private registerMiddlewares(): void {
    // CORS configuration
    const corsConfig = envConfig.getCORSConfig();
    this.app.use(cors(corsConfig));

    // Body parsing middleware
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.json({ limit: '10mb' })); // Built-in body parser in Express with size limit 10 mb to prevent DOS attacks
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Built-in body parser in Express with size limit 10 mb to prevent DOS attacks

    // Request logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`, {
        fileName: __filename,
        methodName: 'requestLogger',
        variables: {
          method: req.method,
          path: req.path,
          query: req.query,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        },
      });
      next();
    });

    logger.info('Middlewares registered successfully', {
      fileName: __filename,
      methodName: 'registerMiddlewares',
    });
  }

  /**
   * @method registerAppRoutes
   * @description Register application routes
   */
  private registerAppRoutes(): void {
    this.app.use('/', routes);

    logger.info('Application routes registered successfully', {
      fileName: __filename,
      methodName: 'registerAppRoutes',
    });
  }

  /**
   * @method registerErrorHandlingRoutes
   * @description Register error handling routes (catch-all)
   */
  private registerErrorHandlingRoutes(): void {
    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      logger.warn('Route not found', {
        fileName: __filename,
        methodName: 'registerErrorHandlingRoutes',
        variables: {
          method: req.method,
          path: req.path,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        },
      });

      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
      });
    });

    // Global error handler
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        const errorResponse = ErrorHandler.handleError(error, {
          req,
          res,
          additionalInfo: {
            fileName: __filename,
            methodName: 'registerErrorHandlingRoutes',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          },
        }, 'Unhandled error occurred');

        res.status(500).json(errorResponse);
      }
    );

    logger.info('Error handling routes registered successfully', {
      fileName: __filename,
      methodName: 'registerErrorHandlingRoutes',
    });
  }

  /**
   * @method getApp
   * @description Get the Express app instance
   * @returns {Application} Express application instance
   */
  public getApp(): Application {
    return this.app;
  }
}

export default App;
