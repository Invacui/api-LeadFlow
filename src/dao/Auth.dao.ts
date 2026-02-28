import { User } from '@prisma/client';
import prisma from '@/db/prisma';
import { IAuthDao } from '@/interfaces/Auth.dto';

/**
 * AuthDao (legacy)
 *
 * @description Minimal DAO implementation used by the legacy auth service.
 * New authentication flows should depend on `modules/auth/Auth.dao` instead,
 * which provides a richer API.
 */
export class AuthDao implements IAuthDao {
  /**
   * Find a user by email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find a user by ID.
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}

export const authDao = new AuthDao();
export default authDao;
