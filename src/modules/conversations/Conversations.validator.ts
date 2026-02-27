import Joi from 'joi';

export const replySchema = Joi.object({
  content: Joi.string().min(1).max(4000).required(),
  channel: Joi.string().valid('EMAIL', 'WHATSAPP').required(),
});
