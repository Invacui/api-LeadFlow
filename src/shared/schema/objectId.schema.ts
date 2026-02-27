import Joi from 'joi';

export const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid MongoDB ObjectId',
});

export const objectIdParamSchema = Joi.object({
  id: objectIdSchema.required(),
});

export default objectIdParamSchema;
