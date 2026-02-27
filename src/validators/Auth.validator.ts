import Joi from 'joi';
import { globalConstants } from '@/constants/Global.constants';
import { Role } from '@prisma/client';

// Create User API Request Validator
export const CreateUserApiRequestValidator = Joi.object({
  email: Joi.string()
    .email()
    .pattern(globalConstants.EMAIL_REGEX)
    .required()
    .messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email should not be empty',
      'string.email': 'Email should be a valid email address',
      'string.pattern.base': 'Email format is invalid',
      'any.required': 'Email is required',
    }),

  name: Joi.string()
    .min(globalConstants.NAME_MIN_LENGTH)
    .max(globalConstants.NAME_MAX_LENGTH)
    .required()
    .messages({
      'string.base': 'Name should be a string',
      'string.empty': 'Name should not be empty',
      'string.min': `Name should be at least ${globalConstants.NAME_MIN_LENGTH} characters long`,
      'string.max': `Name should not exceed ${globalConstants.NAME_MAX_LENGTH} characters`,
      'any.required': 'Name is required',
    }),

  role: Joi.string()
    .valid(...Object.values(Role))
    .required()
    .messages({
      'string.base': 'Role should be a string',
      'string.empty': 'Role should not be empty',
      'any.only': `Role must be one of the following: ${Object.values(
        Role
      ).join(', ')}`,
      'any.required': 'Role is required',
    }),

    isVerified: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'isVerified should be a boolean',
      'any.required': 'isVerified is required',
    }),
  phone: Joi.object({
    countryCode: Joi.string()
      .pattern(globalConstants.COUNTRY_CODE_REGEX)
      .required()
      .messages({
        'string.base': 'Country code should be a string',
        'string.empty': 'Country code should not be empty',
        'string.pattern.base': 'Country code format is invalid (use format: +1)',
        'any.required': 'Country code is required',
      }),
    number: Joi.string()
      .pattern(globalConstants.PHONE_NUMBER_REGEX)
      .required()
      .messages({
        'string.base': 'Phone number should be a string',
        'string.empty': 'Phone number should not be empty',
        'string.pattern.base': 'Phone number format is invalid (use format: 1234567890)',
        'any.required': 'Phone number is required',
      }),
  }).required().messages({
    'object.base': 'Phone should be an object with countryCode and number',
    'any.required': 'Phone is required',
  }),

  password: Joi.string()
    .min(globalConstants.PASSWORD_MIN_LENGTH)
    .max(globalConstants.PASSWORD_MAX_LENGTH)
    .messages({
      'string.base': 'Password should be a string',
      'string.empty': 'Password should not be empty',
      'string.min': `Password should be at least ${globalConstants.PASSWORD_MIN_LENGTH} characters long`,
      'string.max': `Password should not exceed ${globalConstants.PASSWORD_MAX_LENGTH} characters`,
    }),

  provider: Joi.string()
    .messages({
      'string.base': 'Provider should be a string',
      'string.empty': 'Provider should not be empty',
    }),

  providerId: Joi.string()
    .when('provider', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'string.base': 'Provider ID should be a string',
      'string.empty': 'Provider ID should not be empty',
      'any.required': 'Provider ID is required when provider is specified',
      'any.unknown': 'Provider ID should only be provided with a provider',
    }),
}).xor('password', 'provider').messages({
  'object.xor': 'Either password or provider must be provided, but not both',
});

// Update User API Request Validator (for partial updates)
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

  age: Joi.number()
    .integer()
    .min(globalConstants.AGE_MIN)
    .max(globalConstants.AGE_MAX)
    .optional()
    .messages({
      'number.base': 'Age should be a number',
      'number.empty': 'Age should not be empty',
      'number.integer': 'Age should be an integer',
      'number.min': `Age should be at least ${globalConstants.AGE_MIN}`,
      'number.max': `Age should not exceed ${globalConstants.AGE_MAX}`,
    }),

  city: Joi.string()
    .min(globalConstants.CITY_MIN_LENGTH)
    .max(globalConstants.CITY_MAX_LENGTH)
    .optional()
    .messages({
      'string.base': 'City should be a string',
      'string.empty': 'City should not be empty',
      'string.min': `City should be at least ${globalConstants.CITY_MIN_LENGTH} characters long`,
      'string.max': `City should not exceed ${globalConstants.CITY_MAX_LENGTH} characters`,
    }),

  zipCode: Joi.string()
    .pattern(globalConstants.ZIP_CODE_REGEX)
    .optional()
    .messages({
      'string.base': 'Zip code should be a string',
      'string.empty': 'Zip code should not be empty',
      'string.pattern.base':
        'Zip code format is invalid (use format: 12345 or 12345-6789)',
    }),
});

// User ID Parameter Validator
export const UserIdParamValidator = Joi.object({
  userId: Joi.string().required().messages({
    'string.base': 'User ID should be a string',
    'string.empty': 'User ID should not be empty',
    'any.required': 'User ID is required',
  }),
});

export default {
  CreateUserApiRequestValidator,
  UpdateUserApiRequestValidator,
  UserIdParamValidator,
};
