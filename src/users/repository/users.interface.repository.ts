import { UserEntity } from '../entities/user.entity';

export interface UsersRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  getById(id: string): Promise<UserEntity | null>;
  updateEmailVerified(id: string, verified: boolean): Promise<UserEntity>;
}
