// Import logger first to initialize it
import '@/logger/logger';

// Import the App class
import App from '@/app';

// Import environment configuration
import envConfig from '@/config/environment';

// Initialize the application
const app = new App().getApp();

// Get port and base URL from environment configuration
const serverConfig = envConfig.getServerConfig();
const PORT: number = serverConfig.port;
const BASE_URL: string = serverConfig.baseUrl;

// Validate port
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  global.logger.error('Invalid port number', {
    fileName: __filename,
    methodName: 'server',
    variables: { PORT: process.env.PORT },
  });
  process.exit(1);
}

// Start the server
const server = app.listen(PORT, () => {
  global.logger.info(`Server started successfully`, {
    fileName: __filename,
    methodName: 'server',
    variables: {
      baseUrl: BASE_URL,
      port: PORT,
      environment: serverConfig.environment,
      nodeVersion: process.version,
      uptime: process.uptime(),
    },
  });

  console.log(` Server is running on ${BASE_URL}:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health check: ${BASE_URL}:${PORT}/health`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  global.logger.info(`Received ${signal}, starting graceful shutdown`, {
    fileName: __filename,
    methodName: 'gracefulShutdown',
    variables: { signal },
  });

  server.close((err) => {
    if (err) {
      global.logger.error('Error during server shutdown', {
        fileName: __filename,
        methodName: 'gracefulShutdown',
        variables: { error: err.message },
      });
      process.exit(1);
    }

    global.logger.info('Server closed successfully', {
      fileName: __filename,
      methodName: 'gracefulShutdown',
    });

    process.exit(0);
  });

  // Force close server after 10 seconds
  setTimeout(() => {
    global.logger.error('Forced server shutdown after timeout', {
      fileName: __filename,
      methodName: 'gracefulShutdown',
    });
    process.exit(1);
  }, 10000);
};

// Handle different termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  global.logger.error('Uncaught Exception', {
    fileName: __filename,
    methodName: 'uncaughtException',
    variables: {
      error: error.message,
      stack: error.stack,
    },
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  global.logger.error('Unhandled Rejection', {
    fileName: __filename,
    methodName: 'unhandledRejection',
    variables: {
      reason: reason instanceof Error ? reason.message : String(reason),
      promise: promise.toString(),
    },
  });
  process.exit(1);
});

export default server;
