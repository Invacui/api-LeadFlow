// Import Prisma User type and Prisma client instance
import { User } from '@prisma/client';

// Import Prisma client instance
import prisma from '@/db/prisma';

/**
 * AuthDao
 *
 * @description Data Access Object (DAO) class for handling database operations related to authentication. This class provides methods to interact with the User model in the database, including finding users by various criteria (email, ID, tokens), creating new users, updating existing users, and creating corporations. Each method corresponds to a specific database operation and abstracts away the underlying database queries, allowing the service layer to interact with the database through a clean and consistent interface.
 */
export class AuthDao {
  /**
   * findByEmail
   * 
   * @description Finds a user in the database by their email address. This method queries the User model for a record that matches the provided email and returns the corresponding User object if found, or null if no matching user is found. This is typically used during login or when checking for existing users during registration to ensure that email addresses are unique.
   * 
   * @param {string} email - The email address of the user to find. This method queries the database for a user record that matches the provided email address and returns the corresponding User object if found, or null if no matching user is found.
   * @returns {Promise<User | null>} - A promise that resolves to the found User object or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    global.logger.info('Finding user by email [DAO]',
      {
        methodName: this.findByEmail.name,
        fileName: __filename,
        email,
      }
    );
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * findById
   *
   * @description Finds a user in the database by their ID. This method queries the User model for a record that matches the provided ID and returns the corresponding User object if found, or null if no matching user is found.
   * 
   * @param {string} id - The ID of the user to find. This method queries the database for a user record that matches the provided ID and returns the corresponding User object if found, or null if no matching user is found.
   * @returns {Promise<User | null>} - A promise that resolves to the found User object or null if not found.
   */
  async findById(id: string): Promise<User | null> {
    global.logger.info('Finding user by ID [DAO]',
      {
        methodName: this.findById.name,
        fileName: __filename,
        id,
      }
    );
    return prisma.user.findUnique({ where: { id } });
  }

  /**
   * findByEmailVerifyToken
   * 
   * @description Finds a user in the database by their email verification token.
   * 
   * @param {string} token - The email verification token to find the user by.
   * @returns {Promise<User | null>} - A promise that resolves to the found User object or null if not found.
   */
  async findByEmailVerifyToken(token: string): Promise<User | null> {
    global.logger.info('Finding user by email verification token [DAO]',
      {
        methodName: this.findByEmailVerifyToken.name,
        fileName: __filename,
        token,
      }
    );
    return prisma.user.findFirst({ where: { emailVerifyToken: token } });
  }

  /**
   * findByPasswordResetToken
   *
   * @description Finds a user in the database by their password reset token. This method queries the User model for a record that matches the provided password reset token and returns the corresponding User object if found, or null if no matching user is found. This is typically used during the password reset process to validate the token and identify the user who requested the password reset.
   * 
   * @param {string} token - The password reset token to find the user by.
   * @returns {Promise<User | null>} - A promise that resolves to the found User object or null if not found.
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    global.logger.info('Finding user by password reset token [DAO]',
      {
        methodName: this.findByPasswordResetToken.name,
        fileName: __filename,
        token,
      }
    );
    return prisma.user.findFirst({ where: { passwordResetToken: token } });
  }

  /**
   * findByRefreshToken
   * 
   * @description Finds a user in the database by their refresh token. This method queries the User model for a record that matches the provided refresh token and returns the corresponding User object if found, or null if no matching user is found. This is typically used during the token refresh process to validate the refresh token and identify the user associated with it.
   * 
   * @param {string} token - The refresh token to find the user by.
   * @returns {Promise<User | null>} - A promise that resolves to the found User object or null if not found.
   */
  async findByRefreshToken(token: string): Promise<User | null> {
    global.logger.info('Finding user by refresh token [DAO]',
      {
        methodName: this.findByRefreshToken.name,
        fileName: __filename,
        token,
      }
    );
    return prisma.user.findFirst({ where: { refreshToken: token } });
  }

  /**
   * create
   * 
   * @description Creates a new user in the database with the provided data. This method accepts an object containing the necessary fields to create a new user record, such as email, name, password hash, corporation ID, email verification token, email verification expiration time, and token balance. It then uses the Prisma client to insert a new record into the User model and returns the created User object.
   * 
   * @param {Object} data - The user data to create.
   * @returns {Promise<User>} - A promise that resolves to the created User object.
   */
  async create(data: {
    email: string;
    name: string;
    passwordHash: string;
    corporationId: string;
    emailVerifyToken: string;
    emailVerifyExpires: Date;
    tokenBalance: number;
  }): Promise<User> {
    global.logger.info('Creating user [DAO]',
      {
        methodName: this.create.name,
        fileName: __filename,
        email: data.email,
      }
    );
    return prisma.user.create({ data });
  }

  /**
   * update
   * 
   * @description Updates an existing user in the database with the provided data. This method accepts a user ID and a partial object containing the fields to update. It then uses the Prisma client to update the corresponding user record in the User model based on the provided ID and returns the updated User object. This is typically used to update user information such as verification status, password reset tokens, refresh tokens, or other user attributes.
   * 
   * @param {string} id - The ID of the user to update.
   * @param {Partial<User>} data - The partial user data to update.
   * @returns {Promise<User>} - A promise that resolves to the updated User object.
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    global.logger.info('Updating user [DAO]',
      {
        methodName: this.update.name,
        fileName: __filename,
        id,
        data,
      }
    );
    return prisma.user.update({ where: { id }, data });
  }

  /**
   * createCorporation
   *
   * @description Creates a new corporation in the database with the provided name. This method accepts a name string and uses the Prisma client to insert a new record into the Corporation model, returning the created Corporation object.
   *
   * @param {string} name - The name of the corporation to create.
   * @returns {Promise<{ id: string }>} - A promise that resolves to the created Corporation object.
   */
  async createCorporation(name: string): Promise<{ id: string }> {
    global.logger.info('Creating corporation [DAO]',
      {
        methodName: this.createCorporation.name,
        fileName: __filename,
        name,
      }
    );
    return prisma.corporation.create({ data: { name } });
  }
}

export const authDao = new AuthDao();
export default authDao;
