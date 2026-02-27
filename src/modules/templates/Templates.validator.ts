import Joi from 'joi';

const tones = ['PROFESSIONAL', 'CASUAL', 'URGENT', 'FRIENDLY'];

export const createTemplateSchema = Joi.object({
  productName: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  targetAudience: Joi.string().max(500).optional(),
  tone: Joi.string().valid(...tones).optional(),
  cta: Joi.string().max(200).optional(),
});

export const updateTemplateSchema = Joi.object({
  productName: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  targetAudience: Joi.string().max(500).optional(),
  tone: Joi.string().valid(...tones).optional(),
  cta: Joi.string().max(200).optional(),
});

export const launchCampaignSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  leadListIds: Joi.array().items(Joi.string()).min(1).required(),
});
