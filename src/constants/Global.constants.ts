export class GlobalConstants {
  readonly TOKEN_EXPIRY = '15m';
  readonly REFRESH_TOKEN_EXPIRY = '7d';
  readonly JWT_ALGORITHM = 'HS256';
  readonly BCRYPT_ROUNDS = 12;
  readonly MAX_LOGIN_ATTEMPTS = 5;
  readonly LOCKOUT_TIME = 15 * 60 * 1000;
  readonly PASSWORD_MIN_LENGTH = 8;
  readonly PASSWORD_MAX_LENGTH = 128;
  readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  readonly ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;
  readonly NAME_MIN_LENGTH = 2;
  readonly NAME_MAX_LENGTH = 50;
  readonly CITY_MIN_LENGTH = 2;
  readonly CITY_MAX_LENGTH = 50;
  readonly AGE_MIN = 1;
  readonly AGE_MAX = 120;
  readonly DEFAULT_USER_CREDITS = 1000;
  readonly COUNTRY_CODE_REGEX = /^\+\d{1,3}$/;
  readonly PHONE_NUMBER_REGEX = /^\d{4,14}$/;

  // Token costs
  readonly LEAD_PARSE_COST = 1;
  readonly DEDUP_COST = 5;
  readonly EMAIL_SEND_COST = 2;
  readonly WHATSAPP_SEND_COST = 3;
  readonly AI_REPLY_COST = 5;
  readonly FREE_DEMO_TOKENS = 500;
}

export const globalConstants = new GlobalConstants();
export default globalConstants;
