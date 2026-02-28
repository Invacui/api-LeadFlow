import Joi from 'joi';

/**
 * updateTokensSchema
 *
 * @description Validation schema for updating a user's token balance from the admin module.
 * It ensures that `tokenBalance` is a non-negative integer and is always provided. This schema
 * is used to validate the request body before processing admin token balance updates.
 */
export const updateTokensSchema = Joi.object({
  tokenBalance: Joi.number()
    .integer()
    .min(0)
    .required()
    .message('Token balance must be a non-negative integer'),
});
