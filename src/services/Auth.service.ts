import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

import { authDao } from '@/dao/Auth.dao';
import {
  CreateUserRequest,
  getUserByAttrbRequest,
  IAuthService,
  UserDto,
} from '@/interfaces/Auth.dto';
import { globalConstants } from '@/constants/Global.constants';
import { UserAuthResponse } from '@/types';

/**
 * @class AuthService
 * @description Service class for handling user authentication
 */
export class AuthService implements IAuthService {
  /**
   * @method createUser
   * @description Service method for creating a new user
   * @param {CreateUserRequest} userData - User data
   * @returns {Promise<AuthResponse>} User and JWT token
   */
  async createUser(userData: CreateUserRequest): Promise<UserAuthResponse> {
    try {
      logger.info('[SERVICE] Processing request to create a new user', {
        fileName: __filename,
        methodName: this.createUser.name,
        variables: { userData },
      });

      // Check if user already exists
      const existingUserEmail = await authDao.getUserByAttrb({
        accessType: 'email',
        id: userData.email,
      });
      const existingUserPhone = await authDao.getUserByAttrb({
        accessType: 'phone',
        id: userData.phone.number,
      });
      if (existingUserEmail || existingUserPhone) {
        logger.warn('[SERVICE] User already exists.', {
          fileName: __filename,
          methodName: this.createUser.name,
          variables: { email: userData.email },
        });
        throw new Error('User already exists.');
      }

      if (!userData.password && !userData.provider) {
        throw new Error('Password is required for local users');
      } else {
        // Only hash password for local users
        if (!userData.provider && userData.password) {
          const hashedPassword = bcrypt.hash(
            userData.password as string,
            globalConstants.BCRYPT_ROUNDS
          );
          userData.password = await hashedPassword;
        }

        // Create user in database
        const user = await authDao.createUser(userData);

        // Create DTO response
        const userDto = new UserDto(user);

        // Only generate token for local users
        const response: UserAuthResponse = {
          user: userDto.toJSON(),
          token: '', // Default empty token
        };

        if (!userData.provider) {
          response.token = this.generateToken(user.id);
        }

        logger.info('[SERVICE] User created successfully', {
          fileName: __filename,
          methodName: this.createUser.name,
          variables: {
            userId: user.id,
            email: user.email,
            provider: userData.provider,
          },
        });

        return response;
      }
    } catch (error) {
      logger.error('[SERVICE] Error creating user', {
        fileName: __filename,
        methodName: this.createUser.name,
        variables: {
          error: error instanceof Error ? error.message : 'Unknown error',
          userData,
        },
      });
      throw error;
    }
  }

  /**
   * @method getUserByAttrb
   * @description Service method for getting a user by attribute
   * @param {getUserByAttrbRequest} getUserByAttrbRequest - User lookup request
   * @returns {Promise<UserDto | null>} User DTO or null
   */
  async getUserByAttrb(
    getUserByAttrbRequest: getUserByAttrbRequest
  ): Promise<UserDto | null> {
    try {
      logger.info('[SERVICE] Processing request to get user by attribute', {
        fileName: __filename,
        methodName: this.getUserByAttrb.name,
        variables: { getUserByAttrbRequest },
      });

      const user = await authDao.getUserByAttrb(getUserByAttrbRequest);
      if (!user) {
        logger.warn('[SERVICE] User not found', {
          fileName: __filename,
          methodName: this.getUserByAttrb.name,
          variables: { getUserByAttrbRequest },
        });
        return null;
      }

      return new UserDto(user);
    } catch (error) {
      logger.error('[SERVICE] Error getting user by attribute', {
        fileName: __filename,
        methodName: this.getUserByAttrb.name,
        variables: {
          getUserByAttrbRequest,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * @method getAllUsers
   * @description Service method for getting all users
   * @returns {Promise<UserDto[]>} Array of user DTOs
   */
  async getAllUsers(): Promise<UserDto[]> {
    try {
      logger.info('[SERVICE] Processing request to get all users', {
        fileName: __filename,
        methodName: this.getAllUsers.name,
      });

      const users = await authDao.getAllUsers();
      return users.map(user => new UserDto(user));
    } catch (error) {
      logger.error('[SERVICE] Error getting all users', {
        fileName: __filename,
        methodName: this.getAllUsers.name,
        variables: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * @method updateUser
   * @description Service method for updating a user
   * @param {string} userId - User ID
   * @param {Partial<CreateUserRequest>} userData - User data to update
   * @returns {Promise<UserDto | null>} Updated user DTO or null
   */
  async updateUser(
    userId: string,
    userData: Partial<CreateUserRequest>
  ): Promise<UserDto | null> {
    try {
      logger.info('[SERVICE] Processing request to update user', {
        fileName: __filename,
        methodName: this.updateUser.name,
        variables: { userId, userData },
      });

      const user = await authDao.updateUser(userId, userData);
      if (!user) {
        logger.warn('[SERVICE] User not found for update', {
          fileName: __filename,
          methodName: this.updateUser.name,
          variables: { userId },
        });
        return null;
      }

      return new UserDto(user);
    } catch (error) {
      logger.error('[SERVICE] Error updating user', {
        fileName: __filename,
        methodName: this.updateUser.name,
        variables: {
          userId,
          userData,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * @method deleteUser
   * @description Service method for deleting a user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      logger.info('[SERVICE] Processing request to delete user', {
        fileName: __filename,
        methodName: this.deleteUser.name,
        variables: { userId },
      });

      const user = await authDao.deleteUser(userId);
      if (!user) {
        logger.warn('[SERVICE] User not found for deletion', {
          fileName: __filename,
          methodName: this.deleteUser.name,
          variables: { userId },
        });
        return false;
      }

      logger.info('[SERVICE] User deleted successfully', {
        fileName: __filename,
        methodName: this.deleteUser.name,
        variables: { userId, email: user.email },
      });

      return true;
    } catch (error) {
      logger.error('[SERVICE] Error deleting user', {
        fileName: __filename,
        methodName: this.deleteUser.name,
        variables: {
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * @method generateToken
   * @description Generate JWT token for user
   * @param {string} userId - User ID
   * @returns {string} JWT token
   */
  private generateToken(userId: string): string {
    try {
      const payload = { userId };
      const secret = process.env.PRIVATE_TOKEN_KEY;

      if (!secret) {
        throw new Error('JWT secret not configured');
      }

      return jwt.sign(payload, secret, {
        expiresIn: globalConstants.TOKEN_EXPIRY,
        algorithm: globalConstants.JWT_ALGORITHM as jwt.Algorithm,
      });
    } catch (error) {
      logger.error('[SERVICE] Error generating token', {
        fileName: __filename,
        methodName: this.generateToken.name,
        variables: {
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * @method verifyToken
   * @description Verify JWT token
   * @param {string} token - JWT token
   * @returns {any} Decoded token payload
   */
  verifyToken(token: string): any {
    try {
      const secret = process.env.PRIVATE_TOKEN_KEY;

      if (!secret) {
        throw new Error('JWT secret not configured');
      }

      return jwt.verify(token, secret);
    } catch (error) {
      logger.error('[SERVICE] Error verifying token', {
        fileName: __filename,
        methodName: this.verifyToken.name,
        variables: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
