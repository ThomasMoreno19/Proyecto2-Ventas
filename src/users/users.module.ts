import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaUsersRepository } from './repository/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, { provide: 'UsersRepository', useClass: PrismaUsersRepository }],
})
export class UsersModule {}
