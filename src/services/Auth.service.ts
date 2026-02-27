import { authDao } from '@/dao/Auth.dao';
import { CreateUserRequest, IAuthService, UserDto } from '@/interfaces/Auth.dto';
import { UserAuthResponse } from '@/types';

export class AuthService implements IAuthService {
  async createUser(_userData: CreateUserRequest): Promise<UserAuthResponse> {
    throw new Error('Use modules/auth/Auth.service instead');
  }

  async getUserByAttrb(_request: any): Promise<UserDto | null> {
    return null;
  }
}

export const authService = new AuthService();
export default authService;
