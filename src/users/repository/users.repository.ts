import { Injectable } from '@nestjs/common';
import prisma from '../../lib/db';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from './users.interface.repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user as unknown as UserEntity | null;
  }

  async getById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as unknown as UserEntity | null;
  }

  async updateEmailVerified(id: string, verified: boolean): Promise<UserEntity> {
    const updated = await prisma.user.update({
      where: { id },
      data: { emailVerified: verified },
    });
    return updated as unknown as UserEntity;
  }
}
