import Joi from 'joi';
import { globalConstants } from '@/constants/Global.constants';
import { UserRole } from '@prisma/client';

/**
 * UpdateUserApiRequestValidator
 *
 * @description Validation schema for updating an existing user via the public user APIs.
 * All fields are optional but are validated when present. It enforces correct email format,
 * name length constraints, valid role values, and boolean verification flag.
 */
export const UpdateUserApiRequestValidator = Joi.object({
  email: Joi.string()
    .email()
    .pattern(globalConstants.EMAIL_REGEX)
    .optional()
    .message('Email must be a valid email address'),
  name: Joi.string()
    .min(globalConstants.NAME_MIN_LENGTH)
    .max(globalConstants.NAME_MAX_LENGTH)
    .optional()
    .message(`Name must be between ${globalConstants.NAME_MIN_LENGTH} and ${globalConstants.NAME_MAX_LENGTH} characters long`),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional()
    .message('Role must be one of the supported values'),
  isVerified: Joi.boolean()
    .optional()
    .message('isVerified must be a boolean value'),
});

export default { UpdateUserApiRequestValidator };
