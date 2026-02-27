import Joi from 'joi';
export const campaignIdSchema = Joi.object({ id: Joi.string().required() });
