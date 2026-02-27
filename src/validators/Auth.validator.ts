import Joi from 'joi';
import { globalConstants } from '@/constants/Global.constants';

export const CreateUserApiRequestValidator = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(globalConstants.NAME_MIN_LENGTH).max(globalConstants.NAME_MAX_LENGTH).required(),
  password: Joi.string().min(globalConstants.PASSWORD_MIN_LENGTH).max(globalConstants.PASSWORD_MAX_LENGTH).required(),
  corporationName: Joi.string().optional(),
});

export const UpdateUserApiRequestValidator = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().min(globalConstants.NAME_MIN_LENGTH).max(globalConstants.NAME_MAX_LENGTH).optional(),
});

export const UserIdParamValidator = Joi.object({
  userId: Joi.string().required(),
});

export default { CreateUserApiRequestValidator, UpdateUserApiRequestValidator, UserIdParamValidator };
