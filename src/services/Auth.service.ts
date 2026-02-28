import { authDao } from '@/dao/Auth.dao';
import { CreateUserRequest, IAuthService, UserDto } from '@/interfaces/Auth.dto';
import { UserAuthResponse } from '@/types';

/**
 * AuthService (legacy)
 *
 * @description Legacy auth service kept for interface compatibility with older
 * parts of the codebase. All core auth logic has been moved to
 * `modules/auth/Auth.service`. New consumers should use the modular service
 * instead of this one.
 */
export class AuthService implements IAuthService {
  /**
   * Legacy create user method – intentionally not implemented.
   *
   * @throws Error instructing callers to use the modular auth service.
   */
  async createUser(_userData: CreateUserRequest): Promise<UserAuthResponse> {
    throw new Error('Use modules/auth/Auth.service instead');
  }

  /**
   * Legacy method for retrieving a user by arbitrary attribute.
   *
   * @returns Always null; left in place only to satisfy `IAuthService`.
   */
  async getUserByAttrb(_request: any): Promise<UserDto | null> {
    return null;
  }
}

export const authService = new AuthService();
export default authService;
