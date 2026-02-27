import Joi from 'joi';
import { globalConstants } from '@/constants/Global.constants';
import { UserRole } from '@prisma/client';

export const UpdateUserApiRequestValidator = Joi.object({
  email: Joi.string().email().pattern(globalConstants.EMAIL_REGEX).optional(),
  name: Joi.string().min(globalConstants.NAME_MIN_LENGTH).max(globalConstants.NAME_MAX_LENGTH).optional(),
  role: Joi.string().valid(...Object.values(UserRole)).optional(),
  isVerified: Joi.boolean().optional(),
});

export default { UpdateUserApiRequestValidator };
