import Joi from 'joi';

/**
 * campaignIdSchema
 *
 * @description Validation schema for routes that work with a specific campaign.
 * It ensures that the `id` path parameter is provided and is a string. This schema
 * is typically used against `req.params` when fetching, updating, or deleting a campaign.
 */
export const campaignIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .message('Campaign id is required'),
});
