import Joi from 'joi';

/**
 * vlidateRequest
 *
 * @description Validates the given data against the provided Joi schema.
 *
 * @param {JoiObjectSchema} validator
 * @param {T} data
 * @returns { error: string[] | null, value: T }
 */
export const validateRequest = <T>(
  validator: Joi.ObjectSchema,
  data: T
): { error: string[] | null; value: T } => {
  const { error, value } = validator.validate(data, { abortEarly: false });
  return {
    error: error ? error.details.map(detail => detail.message) : null,
    value,
  };
};
