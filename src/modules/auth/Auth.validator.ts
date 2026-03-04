import Joi from 'joi';

/**
 * signupSchema
 * 
 * @description The signupSchema defines the validation rules for the user signup request. It ensures that the email is a valid email address, the name is between 2 and 50 characters long, the password is between 8 and 128 characters long, and the corporation name is between 2 and 100 characters long. This schema is used to validate the incoming data when a user attempts to sign up for an account, ensuring that all required fields are present and meet the specified constraints before allowing the request to proceed.
 */
export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({ 'string.email': 'Email must be a valid email address' }),
  name: Joi.string().min(2).max(50).required().messages({ 'string.length': 'Name must be between 2 and 50 characters long' }),
  password: Joi.string().min(8).max(128).required().messages({ 'string.length': 'Password must be between 8 and 128 characters long' }),
  corporationName: Joi.string().min(2).max(100).required().messages({ 'string.length': 'Corporation name must be between 2 and 100 characters long' }),
});

/**
 * loginSchema
 * 
 * @description The loginSchema defines the validation rules for the user login request. It ensures that the email is a valid email address and that the password is provided. This schema is used to validate the incoming data when a user attempts to log in, ensuring that both the email and password fields are present and that the email is in a valid format before allowing the request to proceed.
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({ 'string.email': 'Email must be a valid email address' }),
  password: Joi.string().required().messages({ 'string.base': 'Password is required' }),
});

/**
 * refreshSchema
 * 
 * @description The refreshSchema defines the validation rules for the token refresh request. It ensures that the refreshToken field is provided and is a string. This schema is used to validate the incoming data when a user attempts to refresh their authentication tokens, ensuring that the required refresh token is present before allowing the request to proceed.
 */
export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({ 'string.base': 'Refresh token is required' }),
});

/**
 * verifyEmailSchema
 * 
 * @description The verifyEmailSchema defines the validation rules for the email verification request. It ensures that the token field is provided and is a string. This schema is used to validate the incoming data when a user attempts to verify their email address, ensuring that the required verification token is present before allowing the request to proceed.
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({ 'string.email': 'Email must be a valid email address' }),
});

/**
 * forgotPasswordSchema
 * 
 * @description The forgotPasswordSchema defines the validation rules for the forgot password request. It ensures that the email is a valid email address and is provided. This schema is used to validate the incoming data when a user initiates a password reset process, ensuring that the required email field is present and in a valid format before allowing the request to proceed.
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({ 'string.base': 'Token is required' }),
  password: Joi.string().min(8).max(128).required().messages({ 'string.length': 'Password must be between 8 and 128 characters long' }),
});

/**
 * resendVerificationSchema
 * 
 * @description The resendVerificationSchema defines the validation rules for the resend email verification request. It ensures that the email is a valid email address and is provided. This schema is used to validate the incoming data when a user requests to resend the email verification link, ensuring that the required email field is present and in a valid format before allowing the request to proceed.
 */
export const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({ 'string.email': 'Email must be a valid email address' }),
});
