import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[source];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
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
