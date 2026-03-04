import Joi from 'joi';

const tones = ['PROFESSIONAL', 'CASUAL', 'URGENT', 'FRIENDLY'];

/**
 * createTemplateSchema
 *
 * @description Validation schema for creating a new message template. It validates the
 * product name, description, optional target audience, optional tone, and optional CTA.
 * This schema is typically used to validate `req.body` when a client creates a template.
 */
export const createTemplateSchema = Joi.object({
  productName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({ 'string.length': 'Product name must be between 2 and 100 characters long' }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({ 'string.length': 'Description must be between 10 and 2000 characters long' }),
  targetAudience: Joi.string()
    .max(500)
    .optional()
    .messages({ 'string.max': 'Target audience must not exceed 500 characters' }),
  tone: Joi.string()
    .valid(...tones)
    .optional()
    .messages({ 'string.valid': 'Tone must be one of the supported values' }),
  cta: Joi.string()
    .max(200)
    .optional()
    .messages({ 'string.max': 'CTA must not exceed 200 characters' }),
});

/**
 * updateTemplateSchema
 *
 * @description Validation schema for updating an existing message template. All fields are optional
 * but are validated when present. This schema is typically used to validate `req.body` for
 * partial updates to a template.
 */
export const updateTemplateSchema = Joi.object({
  productName: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({ 'string.length': 'Product name must be between 2 and 100 characters long' }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .optional()
    .messages({ 'string.length': 'Description must be between 10 and 2000 characters long' }),
  targetAudience: Joi.string()
    .max(500)
    .optional()
    .messages({ 'string.max': 'Target audience must not exceed 500 characters' }),
  tone: Joi.string()
    .valid(...tones)
    .optional()
    .messages({ 'string.valid': 'Tone must be one of the supported values' }),
  cta: Joi.string()
    .max(200)
    .optional()
    .messages({ 'string.max': 'CTA must not exceed 200 characters' }),
});

/**
 * launchCampaignSchema
 *
 * @description Validation schema for launching a campaign from one or more templates and lead lists.
 * It ensures a campaign name is provided and that at least one lead list ID is supplied.
 */
export const launchCampaignSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({ 'string.length': 'Campaign name must be between 2 and 100 characters long' }),
  leadListIds: Joi.array()
    .items(Joi.string().messages({ 'string.base': 'Each lead list id must be a string' }))
    .min(1)
    .required()
    .messages({ 'array.min': 'At least one lead list id is required' }),
});
