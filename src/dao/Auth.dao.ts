import { User } from '@prisma/client';
import prisma from '@/db/prisma';
import { CreateUserRequest, getUserByAttrbRequest, IAuthDao } from '@/interfaces/Auth.dto';

/**
 * @class AuthDao
 * @description DAO class for handling user authentication with Prisma
 */
export class AuthDao implements IAuthDao {
  /**
   * @method createUser
   * @description DAO method for creating a new user
   * @param {CreateUserRequest} userData - User data
   * @returns {Promise<User>} Created user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      logger.info('[DAO] Processing request to create a new user', {
        fileName: __filename,
        methodName: this.createUser.name,
        variables: { userData },
      });

      const user = await prisma.user.create({
        data: userData,
      });

      logger.info('[DAO] User created successfully', {
        fileName: __filename,
        methodName: this.createUser.name,
        variables: { userId: user.id, email: user.email },
      });

      return user;
    } catch (error) {
      logger.error('[DAO] Error creating user', {
        fileName: __filename,
        methodName: this.createUser.name,
        variables: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * @method getUserByAttrb
   * @description DAO method for getting a user by email
   * @param {getUserByAttrb} getUserByAttrbRequest - User email
   * @returns {Promise<User | null>} User or null if not found
   */
  async getUserByAttrb(
    getUserByAttrbRequest: getUserByAttrbRequest
  ): Promise<User | null> {
    try {
      logger.info('[DAO] Processing request to get user by email', {
        fileName: __filename,
        methodName: this.getUserByAttrb.name,
        variables: { getUserByAttrbRequest },
      });

      const user = await prisma.user.findFirst({
        where: {
          ...getUserByAttrbRequest.accessType === 'email' ? { email: getUserByAttrbRequest.id } : {},
          ...getUserByAttrbRequest.accessType === 'id' ? { id: getUserByAttrbRequest.id } : {},
          ...getUserByAttrbRequest.accessType === 'phone' ? { 
            phone: { 
              is: { 
                number: getUserByAttrbRequest.id 
              } 
            } 
          } : {},
          isDeleted: false,
        },
      });

      logger.info('[DAO] User lookup completed', {
        fileName: __filename,
        methodName: this.getUserByAttrb.name,
        variables: { getUserByAttrbRequest, found: !!user },
      });

      return user;
    } catch (error) {
      logger.error('[DAO] Error getting user by email', {
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
   * @description DAO method for getting all users
   * @returns {Promise<User[]>} Array of users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      logger.info('[DAO] Processing request to get all users', {
        fileName: __filename,
        methodName: this.getAllUsers.name,
      });

      const users = await prisma.user.findMany({
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info('[DAO] All users retrieved successfully', {
        fileName: __filename,
        methodName: this.getAllUsers.name,
        variables: { count: users.length },
      });

      return users;
    } catch (error) {
      logger.error('[DAO] Error getting all users', {
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
   * @description DAO method for updating a user
   * @param {string} id - User ID
   * @param {Partial<CreateUserRequest>} userData - User data to update
   * @returns {Promise<User | null>} Updated user or null if not found
   */
  async updateUser(
    id: string,
    userData: Partial<CreateUserRequest>
  ): Promise<User | null> {
    try {
      logger.info('[DAO] Processing request to update user', {
        fileName: __filename,
        methodName: this.updateUser.name,
        variables: { id, userData },
      });

      const user = await prisma.user.update({
        where: { id },
        data: userData,
      });

      logger.info('[DAO] User updated successfully', {
        fileName: __filename,
        methodName: this.updateUser.name,
        variables: { id, email: user.email },
      });

      return user;
    } catch (error) {
      logger.error('[DAO] Error updating user', {
        fileName: __filename,
        methodName: this.updateUser.name,
        variables: {
          id,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * @method deleteUser
   * @description DAO method for soft deleting a user
   * @param {string} id - User ID
   * @returns {Promise<User | null>} Deleted user or null if not found
   */
  async deleteUser(id: string): Promise<User | null> {
    try {
      logger.info('[DAO] Processing request to delete user', {
        fileName: __filename,
        methodName: this.deleteUser.name,
        variables: { id },
      });

      const user = await prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });

      logger.info('[DAO] User deleted successfully', {
        fileName: __filename,
        methodName: this.deleteUser.name,
        variables: { id, email: user.email },
      });

      return user;
    } catch (error) {
      logger.error('[DAO] Error deleting user', {
        fileName: __filename,
        methodName: this.deleteUser.name,
        variables: {
          id,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }
}

// Export singleton instance
export const authDao = new AuthDao();
export default authDao;
