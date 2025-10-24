import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteRepository } from './repository/cliente.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ClienteController } from './cliente.controller';

@Module({
  controllers: [ClienteController],
  providers: [PrismaService, ClienteRepository, ClienteService],
})
export class clienteModule {}
