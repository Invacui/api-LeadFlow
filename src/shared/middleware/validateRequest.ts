import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * validateRequest
 * 
 * Middleware to validate incoming requests against a Joi schema.
 * 
 * @param schema Joi validation schema to validate the request data against. Should be an object schema defining the expected structure and constraints of the request body, query parameters, or URL parameters.
 * @param source Specifies where to validate the data from: 'body' for request body, 'query' for query parameters, or 'params' for URL parameters. Defaults to 'body'. 
 * @returns next() if validation passes, otherwise responds with a 422 status and error details. The middleware validates the incoming request data against the provided Joi schema and ensures that it meets the defined requirements before allowing the request to proceed to the next handler.
 */
export const validateRequest = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[source];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      global.logger.error('Validation Failed [MIDDLEWARE]', {
        fileName: __filename,
        methodName: 'validateRequest',
        variables: {
          error,
        },
      });
      res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message),
      });
      return;
    }
    next();
  };
};

export default validateRequest;
