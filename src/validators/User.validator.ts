import Joi from 'joi';
import { globalConstants } from '@/constants/Global.constants';
import { Role } from '@prisma/client';

// Create User API Request Validator
export const UpdateUserApiRequestValidator = Joi.object({
  email: Joi.string()
    .email()
    .pattern(globalConstants.EMAIL_REGEX)
    .optional()
    .messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email should not be empty',
      'string.email': 'Email should be a valid email address',
      'string.pattern.base': 'Email format is invalid',
    }),
  name: Joi.string()
    .min(globalConstants.NAME_MIN_LENGTH)
    .max(globalConstants.NAME_MAX_LENGTH)
    .optional()
    .messages({
      'string.base': 'Name should be a string',
      'string.empty': 'Name should not be empty',
      'string.min': `Name should be at least ${globalConstants.NAME_MIN_LENGTH} characters long`,
      'string.max': `Name should not exceed ${globalConstants.NAME_MAX_LENGTH} characters`,
    }),
  role: Joi.string()
    .valid(...Object.values(Role))
    .optional()
    .messages({
      'string.base': 'Role should be a string',
      'string.empty': 'Role should not be empty',
      'any.only': `Role must be one of the following: ${Object.values(
        Role
      ).join(', ')}`,
    }),
  isVerified: Joi.boolean().optional().messages({
    'boolean.base': 'isVerified should be a boolean',
  }),
  phone: Joi.object({
    countryCode: Joi.string()
      .pattern(globalConstants.COUNTRY_CODE_REGEX)
      .optional()
      .messages({
        'string.base': 'Country code should be a string',
        'string.empty': 'Country code should not be empty',
        'string.pattern.base':
          'Country code format is invalid (use format: +1)',
      }),
    number: Joi.string()
      .pattern(globalConstants.PHONE_NUMBER_REGEX)
      .optional()
      .messages({
        'string.base': 'Phone number should be a string',
        'string.empty': 'Phone number should not be empty',
        'string.pattern.base': 'Phone number format is invalid',
      }),
  })
    .optional()
    .messages({
      'object.base': 'Phone should be an object with countryCode and number',
    }),
});

export default {
  UpdateUserApiRequestValidator,
};
