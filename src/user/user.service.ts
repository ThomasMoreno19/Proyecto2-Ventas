import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async update(id: number, user: User): Promise<User> {
    return this.userRepository.update(id, user);
  }

  async softDelete(id: number): Promise<void> {
    return this.userRepository.softDelete(id);
  }
}
