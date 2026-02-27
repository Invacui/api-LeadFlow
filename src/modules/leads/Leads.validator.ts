import Joi from 'joi';

const industries = ['EDTECH','PHARMACEUTICAL','REALESTATE','FINTECH','HEALTHCARE','SAAS',
  'MANUFACTURING','RETAIL','LOGISTICS','HOSPITALITY','LEGAL','AUTOMOTIVE',
  'TELECOM','MEDIA','NGO','CONSULTING','OTHER'];

export const createByLinkSchema = Joi.object({
  listName: Joi.string().min(2).max(100).required(),
  industry: Joi.string().valid(...industries).required(),
  description: Joi.string().max(500).optional(),
  fileUrl: Joi.string().uri().required(),
});

export const createByUploadSchema = Joi.object({
  listName: Joi.string().min(2).max(100).required(),
  industry: Joi.string().valid(...industries).required(),
  description: Joi.string().max(500).optional(),
});
