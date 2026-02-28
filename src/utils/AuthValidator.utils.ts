import Joi from 'joi';

/**
 * validateRequest
 *
 * @description Validates the given data against the provided Joi object schema.
 * It always returns the (potentially coerced) value and an array of error messages
 * when validation fails. This utility is useful outside of the Express middleware
 * context where you still want Joi-style validation with structured errors.
 *
 * @template T Type of the data being validated.
 * @param {Joi.ObjectSchema} validator Joi schema used to validate the data.
 * @param {T} data Arbitrary data to validate.
 * @returns {{ error: string[] | null; value: T }} Object containing either a list of
 *          human-readable error messages or null when validation succeeds, alongside
 *          the validated value.
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
