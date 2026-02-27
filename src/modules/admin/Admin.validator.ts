import Joi from 'joi';

export const updateTokensSchema = Joi.object({
  tokenBalance: Joi.number().integer().min(0).required(),
});
