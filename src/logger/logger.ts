import * as path from 'path';

/** ANSI color codes for terminal output */
enum Colors {
  RESET = "\x1b[0m",
  RED = "\x1b[31m",
  BLUE = "\x1b[34m",
  YELLOW = "\x1b[33m",
  GREEN = "\x1b[32m",
  UNDERLINE = "\x1b[4m"
}

/** Available log levels */
enum LogLevel {
  ERROR = "error",
  DEBUG = "debug", 
  WARN = "warn",
  INFO = "info"
}

/** Context object for log messages */
interface LogContext {
  /** Name of the file where the log is called from */
  fileName?: string;
  /** Name of the method where the log is called from */
  methodName?: string;
  /** Additional variables to log */
  [key: string]: any;
}

/** Logger interface defining the contract */
interface ILogger {
  logMessage(level: LogLevel | string, message: string, context?: LogContext): void;
  getFileNameFromModule(fileName?: string): string | null;
  error(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
}

/** Mapping of log levels to their corresponding colors */
const LOG_LEVEL_COLORS: Record<string, Colors> = {
  [LogLevel.ERROR]: Colors.RED,
  [LogLevel.DEBUG]: Colors.BLUE,
  [LogLevel.WARN]: Colors.YELLOW,
  [LogLevel.INFO]: Colors.GREEN,
};

/**
 * Global logger implementation
 * Provides structured logging with colors and context information
 */
const logger: ILogger = {
  /**
   * Core logging method that handles message formatting and output
   * @param level - The log level (error, debug, warn, info)
   * @param message - The main log message
   * @param context - Additional context including fileName, methodName, and variables
   */
  logMessage: (level: LogLevel | string, message: string, context: LogContext = {}): void => {
    // Select color based on log level, default to reset if not found
    const color: Colors = LOG_LEVEL_COLORS[level] || Colors.RESET;

    const { fileName, methodName, ...variables } = context;
    
    // Get the current file name safely from module.filename
    const resolvedFileName: string = logger.getFileNameFromModule(fileName) || fileName || "unknown_file";
    const resolvedMethodName: string = methodName || "unknown_method";

    // Construct variables string if variables exist
    let variableStr = "";
    if (Object.keys(variables).length > 0) {
      variableStr = "\n[VARIABLES]: ";
      
      for (const [key, value] of Object.entries(variables)) {
        let formattedValue = value;
        
        // Format URLs with underline and blue color
        if (typeof value === "string" && value.startsWith("http")) {
          formattedValue = `${Colors.UNDERLINE}${Colors.BLUE}${value}${Colors.RESET}`;
        }
        
        variableStr += `\n ${key}: ${JSON.stringify(formattedValue, null, 2)}`;
      }
    }

    console.log(`${color}[${level.toUpperCase()}] [${resolvedFileName}] [${resolvedMethodName}] ${message}${Colors.RESET}${variableStr}`);
  },

  /**
   * Helper function to extract filename from a full file path
   * @param fileName - Full file path
   * @returns Extracted filename or null if no fileName provided
   */
  getFileNameFromModule: (fileName?: string): string | null => {
    if (!fileName) {
      return null;
    }
    return fileName.slice(fileName.lastIndexOf(path.sep) + 1);
  },

  /**
   * Log an error message
   * @param message - Error message to log
   * @param context - Additional context for the error
   */
  error: (message: string, context?: LogContext): void => {
    logger.logMessage(LogLevel.ERROR, message, context);
  },

  /**
   * Log a debug message
   * @param message - Debug message to log
   * @param context - Additional context for debugging
   */
  debug: (message: string, context?: LogContext): void => {
    logger.logMessage(LogLevel.DEBUG, message, context);
  },

  /**
   * Log a warning message
   * @param message - Warning message to log
   * @param context - Additional context for the warning
   */
  warn: (message: string, context?: LogContext): void => {
    logger.logMessage(LogLevel.WARN, message, context);
  },

  /**
   * Log an info message
   * @param message - Info message to log
   * @param context - Additional context for the info
   */
  info: (message: string, context?: LogContext): void => {
    logger.logMessage(LogLevel.INFO, message, context);
  },
};

// Make logger available globally
declare global {
  var logger: ILogger;
}

global.logger = logger;

export { logger, LogLevel, LogContext, ILogger, Colors };