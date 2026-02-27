import { Request, Response } from 'express';

/**
 * Interface for structured error responses
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
  details?: any;
  timestamp: string;
  path?: string;
  method?: string;
}

/**
 * Interface for error context
 */
export interface ErrorContext {
  req?: Request;
  res?: Response;
  additionalInfo?: Record<string, any>;
}

/**
 * Utility class for handling and formatting errors
 */
export class ErrorHandler {
  /**
   * Clean ANSI escape sequences from error messages
   * @param message - The error message that may contain ANSI codes
   * @returns Cleaned message without ANSI escape sequences
   */
  private static cleanAnsiCodes(message: string): string {
    // Remove ANSI escape sequences (color codes, etc.)
    return message.replace(/\x1b\[[0-9;]*m/g, '');
  }

  /**
   * Format stack trace for better readability
   * @param stack - The error stack trace
   * @returns Formatted stack trace
   */
  private static formatStackTrace(stack?: string): string | undefined {
    if (!stack) return undefined;

    // Clean ANSI codes from stack trace
    const cleanStack = this.cleanAnsiCodes(stack);

    // Split stack into lines and format
    const stackLines = cleanStack.split('\n');
    const formattedLines = stackLines.map((line, index) => {
      // Skip the first line (error message) as it's already in the error field
      if (index === 0) return null;
      
      // Clean up file paths for better readability
      const cleanedLine = line
        .replace(/\\/g, '/') // Convert Windows paths to Unix style
        .replace(/E:\/WORK_OFFICE\/My_Personal_Projects\/M_API_BACKEND\//g, '') // Remove absolute path
        .trim();
      
      return cleanedLine;
    }).filter(Boolean);

    return formattedLines.join('\n');
  }

  /**
   * Extract meaningful error information from Prisma errors
   * @param error - The error object
   * @returns Cleaned error information
   */
  private static extractPrismaErrorInfo(error: any): { message: string; details?: any } {
    let message = error.message || 'Unknown error';
    let details: any = undefined;

    // Clean ANSI codes from the message
    message = this.cleanAnsiCodes(message);

    // Handle Prisma-specific errors
    if (error.code) {
      details = { code: error.code };
    }

    // Extract Prisma error details if available
    if (error.meta) {
      details = { ...details, meta: error.meta };
    }

    return { message, details };
  }

  /**
   * Create a structured error response
   * @param error - The error object
   * @param context - Additional context about the error
   * @returns Formatted error response
   */
  public static createErrorResponse(
    error: any,
    context?: ErrorContext
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    
    // Extract error information
    const { message, details } = this.extractPrismaErrorInfo(error);
    
    // Format stack trace
    const stack = this.formatStackTrace(error.stack);

    // Create base error response
    const errorResponse: ErrorResponse = {
      success: false,
      message: 'Internal Server Error',
      error: message,
      timestamp,
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && stack) {
      errorResponse.stack = stack;
    }

    // Add details if available
    if (details) {
      errorResponse.details = details;
    }

    // Add request context if available
    if (context?.req) {
      errorResponse.path = context.req.path;
      errorResponse.method = context.req.method;
    }

    // Add additional info if provided
    if (context?.additionalInfo) {
      errorResponse.details = { ...errorResponse.details, ...context.additionalInfo };
    }

    return errorResponse;
  }

  /**
   * Handle and log errors with proper formatting
   * @param error - The error object
   * @param context - Additional context
   * @param customMessage - Custom error message
   */
  public static handleError(
    error: any,
    context?: ErrorContext,
    customMessage?: string
  ): ErrorResponse {
    // Log the error with full details
    logger.error(customMessage || 'Error occurred', {
      fileName: context?.additionalInfo?.fileName || 'unknown',
      methodName: context?.additionalInfo?.methodName || 'unknown',
      variables: {
        error: this.cleanAnsiCodes(error.message || 'Unknown error'),
        stack: error.stack,
        path: context?.req?.path,
        method: context?.req?.method,
        ...context?.additionalInfo,
      },
    });

    // Create and return formatted error response
    return this.createErrorResponse(error, context);
  }

  /**
   * Create a validation error response
   * @param validationErrors - Array of validation errors
   * @param context - Additional context
   * @returns Formatted validation error response
   */
  public static createValidationErrorResponse(
    validationErrors: string[],
    context?: ErrorContext
  ): ErrorResponse {
    const timestamp = new Date().toISOString();

    return {
      success: false,
      message: 'Validation Error',
      error: 'Request validation failed',
      details: validationErrors,
      timestamp,
      path: context?.req?.path,
      method: context?.req?.method,
    };
  }

  /**
   * Create a not found error response
   * @param resource - The resource that was not found
   * @param context - Additional context
   * @returns Formatted not found error response
   */
  public static createNotFoundErrorResponse(
    resource: string,
    context?: ErrorContext
  ): ErrorResponse {
    const timestamp = new Date().toISOString();

    return {
      success: false,
      message: `${resource} not found`,
      error: `The requested ${resource.toLowerCase()} could not be found`,
      timestamp,
      path: context?.req?.path,
      method: context?.req?.method,
    };
  }
}

export default ErrorHandler;
