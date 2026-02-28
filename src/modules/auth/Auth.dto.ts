import { UserRole } from '@prisma/client';

/**
 * @description This file defines the data transfer objects (DTOs) used in the authentication module. These interfaces represent the structure of the data that is sent and received by the authentication service, including requests for signing up, logging in, refreshing tokens, password reset, and user information responses.
 */
export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  corporationName: string;
}

/**
 * @description The LoginRequest interface defines the structure of the data required for a user to log in. It includes the user's email and password, which are necessary for authentication. This DTO is used when a user attempts to log in to the system, allowing the authentication service to validate the credentials and generate the appropriate tokens if the login is successful.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * @description The RefreshRequest interface defines the structure of the data required to refresh authentication tokens. It includes a single field, refreshToken, which is a string representing the refresh token issued during the initial login. This DTO is used when a user wants to obtain new access and refresh tokens without having to log in again, allowing for continued authenticated access to the system.
 */
export interface RefreshRequest {
  refreshToken: string;
}

/**
 * @description The ForgotPasswordRequest interface defines the structure of the data required for a user to initiate a password reset process. It includes a single field, email, which is a string representing the user's email address. This DTO is used when a user has forgotten their password and needs to receive instructions or a token to reset it, allowing the authentication service to send the necessary information to the user's email.
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * @description The ResetPasswordRequest interface defines the structure of the data required for a user to reset their password. It includes two fields: token, which is a string representing the password reset token issued during the forgot password process, and password, which is a string representing the new password that the user wants to set. This DTO is used when a user has received a password reset token and wants to update their password, allowing the authentication service to validate the token and update the user's password accordingly.
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

/**
 * @description The VerifyEmailRequest interface defines the structure of the data required for a user to verify their email address. It includes a single field, token, which is a string representing the email verification token issued during the signup process. This DTO is used when a user clicks on the verification link sent to their email, allowing the authentication service to validate the token and mark the user's email as verified in the system.
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * @description The TokenUserPayload interface defines the structure of the payload that is included in the authentication tokens (such as JWTs) issued to users upon successful login. It includes the user's id, role, and token balance. This DTO is used to encapsulate the essential information about the user that needs to be included in the token for authentication and authorization purposes, allowing the system to identify the user and their permissions when they make authenticated requests.
 */
export interface TokenUserPayload {
  id: string;
  role: UserRole;
  tokenBalance: number;
}

/**
 * @description The LoginResponse interface defines the structure of the data returned to the client upon a successful login. It includes the user's id, email, name, role, verification status, token balance, corporation ID, and the authentication tokens (access and refresh tokens). This DTO is used to provide the client with all the necessary information about the authenticated user and the tokens required for subsequent authenticated requests.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * @description The MeResponse interface defines the structure of the data returned to the client when requesting the authenticated user's information (e.g., via a /me endpoint). It includes the user's id, email, name, role, verification status, token balance, corporation ID, and timestamps for when the user was created and last updated. This DTO is used to provide the client with detailed information about the currently authenticated user.
 */
export interface MeResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  tokenBalance: number;
  corporationId: string;
  createdAt: Date;
  updatedAt: Date;
}
