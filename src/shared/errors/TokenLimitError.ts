import { AppError } from './AppError';
export class TokenLimitError extends AppError {
  constructor(message = 'Insufficient token balance') {
    super(message, 402, 'INSUFFICIENT_TOKENS');
  }
}
export default TokenLimitError;
