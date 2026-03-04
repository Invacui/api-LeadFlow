import Joi from 'joi';

/**
 * replySchema
 *
 * @description Validation schema for sending a reply in a conversation. It ensures that
 * a non-empty content string is provided and that the channel is one of the supported
 * values (EMAIL or WHATSAPP). This schema is typically used to validate `req.body`
 * when replying to a conversation thread.
 */
export const replySchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(4000)
    .required()
    .messages({ 'string.length': 'Content is required and must be between 1 and 4000 characters long' }),
  channel: Joi.string()
    .valid('EMAIL', 'WHATSAPP')
    .required()
    .messages({ 'string.valid': 'Channel must be either EMAIL or WHATSAPP' }),
});
