import { User } from '@prisma/client';
import prisma from '@/db/prisma';

export class AuthDao {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmailVerifyToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { emailVerifyToken: token } });
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { passwordResetToken: token } });
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { refreshToken: token } });
  }

  async create(data: {
    email: string;
    name: string;
    passwordHash: string;
    corporationId: string;
    emailVerifyToken: string;
    emailVerifyExpires: Date;
    tokenBalance: number;
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async createCorporation(name: string): Promise<{ id: string }> {
    return prisma.corporation.create({ data: { name } });
  }
}

export const authDao = new AuthDao();
export default authDao;
