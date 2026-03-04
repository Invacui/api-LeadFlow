import Joi from 'joi';
import { globalConstants } from '@/constants/Global.constants';

/**
 * CreateUserApiRequestValidator
 *
 * @description Validation schema for creating a new user via the legacy auth routes.
 * It enforces email format, name length, password strength, and optional corporation name.
 */
export const CreateUserApiRequestValidator = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({ 'string.email': 'Email must be a valid email address' }),
  name: Joi.string()
    .min(globalConstants.NAME_MIN_LENGTH)
    .max(globalConstants.NAME_MAX_LENGTH)
    .required()
    .messages({ 'string.name': `Name must be between ${globalConstants.NAME_MIN_LENGTH} and ${globalConstants.NAME_MAX_LENGTH} characters long` }),
  password: Joi.string()
    .min(globalConstants.PASSWORD_MIN_LENGTH)
    .max(globalConstants.PASSWORD_MAX_LENGTH)
    .required()
    .messages({ 'string.password': `Password must be between ${globalConstants.PASSWORD_MIN_LENGTH} and ${globalConstants.PASSWORD_MAX_LENGTH} characters long` }),
  corporationName: Joi.string()
    .optional()
    .messages({ 'string.corporationName': 'Corporation name must be a string' }),
});

/**
 * UpdateUserApiRequestValidator
 *
 * @description Validation schema for updating an existing user via the legacy auth routes.
 * All fields are optional but are validated when present. It reuses the same constraints as
 * the create schema for email and name.
 */
export const UpdateUserApiRequestValidator = Joi.object({
  email: Joi.string()
    .email()
    .optional()
    .messages({ 'string.email': 'Email must be a valid email address' }),
  name: Joi.string()
    .min(globalConstants.NAME_MIN_LENGTH)
    .max(globalConstants.NAME_MAX_LENGTH)
    .optional()
    .messages({ 'string.name': `Name must be between ${globalConstants.NAME_MIN_LENGTH} and ${globalConstants.NAME_MAX_LENGTH} characters long` }),
});

/**
 * UserIdParamValidator
 *
 * @description Validation schema for routes that require a `userId` path parameter
 * for identifying a specific user.
 */
export const UserIdParamValidator = Joi.object({
  userId: Joi.string()
    .required()
    .messages({ 'any.required': 'User id is required' }),
});

export default { CreateUserApiRequestValidator, UpdateUserApiRequestValidator, UserIdParamValidator };
