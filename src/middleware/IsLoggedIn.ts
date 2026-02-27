import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTPayload } from '@/types';

/**
 * @function isLoggedIn
 * @description Middleware to check if the user is logged in and has a valid JWT token
 * @param {AuthenticatedRequest} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const isLoggedIn = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-api-key'] as string;
    const secretKey = process.env.PRIVATE_TOKEN_KEY;

    if (!secretKey) {
      logger.error('[middleware] JWT secret key not configured', {
        fileName: __filename,
        methodName: 'isLoggedIn',
      });
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    let token: string | undefined;

    // Check Authorization header first (Bearer token)
    if (authHeader) {
      token = authHeader.split(' ')[1]; // Bearer TOKEN
    }
    // Fallback to X-API-Key header
    else if (apiKeyHeader) {
      token = apiKeyHeader;
    }

    if (!token) {
      logger.warn('[middleware] No token provided in any header', {
        fileName: __filename,
        methodName: 'isLoggedIn',
        variables: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          hasAuthHeader: !!authHeader,
          hasApiKeyHeader: !!apiKeyHeader,
        },
      });
      res.status(401).json({
        message: 'Access denied. No token provided.',
        hint: 'Use Authorization: Bearer <token> or X-API-Key: <token> header',
      });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, secretKey) as JWTPayload;

    // Add user information to request object
    req.user = {
      userId: decoded.userId,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    logger.info('[middleware] User authenticated successfully', {
      fileName: __filename,
      methodName: 'isLoggedIn',
      variables: {
        userId: decoded.userId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        tokenSource: authHeader ? 'Authorization' : 'X-API-Key',
      },
    });

    next();
  } catch (error) {
    // ...existing error handling...
  }
};

export default isLoggedIn;
