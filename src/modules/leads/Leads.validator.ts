import Joi from 'joi';

const industries = ['EDTECH','PHARMACEUTICAL','REALESTATE','FINTECH','HEALTHCARE','SAAS',
  'MANUFACTURING','RETAIL','LOGISTICS','HOSPITALITY','LEGAL','AUTOMOTIVE',
  'TELECOM','MEDIA','NGO','CONSULTING','OTHER'];

/**
 * createByLinkSchema
 *
 * @description Validation schema for creating a lead list by providing a file URL.
 * It enforces constraints on the list name, industry, optional description, and file URL.
 * This schema is typically used to validate `req.body` when the client sends a link-based import request.
 */
export const createByLinkSchema = Joi.object({
  listName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({ 'string.length': 'List name must be between 2 and 100 characters long' }),
  industry: Joi.string()
    .valid(...industries)
    .required()
    .messages({ 'string.valid': 'Industry must be one of the supported values' }),
  description: Joi.string()
    .max(500)
    .optional()
    .messages({ 'string.max': 'Description must not exceed 500 characters' }),
  fileUrl: Joi.string()
    .uri()
    .required()
    .messages({ 'string.uri': 'File URL is required and must be a valid URI' }),
});

/**
 * createByUploadSchema
 *
 * @description Validation schema for creating a lead list by uploading a file.
 * It enforces constraints on the list name, industry, and optional description. The
 * actual file payload is typically validated by the upload middleware, while this
 * schema focuses on the metadata sent in the request body.
 */
export const createByUploadSchema = Joi.object({
  listName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({ 'string.length': 'List name must be between 2 and 100 characters long' }),
  industry: Joi.string()
    .valid(...industries)
    .required()
    .messages({ 'string.valid': 'Industry must be one of the supported values' }),
  description: Joi.string()
    .max(500)
    .optional()
    .messages({ 'string.max': 'Description must not exceed 500 characters' }),
});
