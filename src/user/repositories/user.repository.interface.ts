import { User, Prisma } from '@prisma/client';

export interface IUserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  update(id: number, data: Prisma.UserUpdateInput): Promise<User>;
  softDelete(id: number): Promise<User>;
}
