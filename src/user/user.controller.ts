import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Post()
  create(): string {
    return 'This action adds a new user';
  }
}
