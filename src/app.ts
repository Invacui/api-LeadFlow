import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import envConfig from '@/config/environment';
import legacyRoutes from '@/routes/Index.routes';
import ErrorHandler from '@/utils/ErrorHandler.utils';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.registerMiddlewares();
    this.registerAppRoutes();
    this.registerErrorHandlingRoutes();
  }

  private registerMiddlewares(): void {
    const corsConfig = envConfig.getCORSConfig();
    this.app.use(cors(corsConfig));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`, { fileName: __filename, methodName: 'requestLogger' });
      next();
    });
  }

  private registerAppRoutes(): void {
    // Legacy routes
    this.app.use('/api/v1', legacyRoutes);
  }

  private registerErrorHandlingRoutes(): void {
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ success: false, message: 'Route not found', path: req.path });
    });
    this.app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
      const errorResponse = ErrorHandler.handleError(error, { req, res }, 'Unhandled error');
      res.status(500).json(errorResponse);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;
