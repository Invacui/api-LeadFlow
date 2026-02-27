import { User } from '@prisma/client';
import prisma from '@/db/prisma';
import { IAuthDao } from '@/interfaces/Auth.dto';

export class AuthDao implements IAuthDao {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}

export const authDao = new AuthDao();
export default authDao;
