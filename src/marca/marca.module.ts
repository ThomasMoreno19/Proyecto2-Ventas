import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaRepository } from './repositories/marca.repository';
import { PrismaService } from '../prisma/prisma.service';
import { MarcaController } from './marca.controller';

@Module({
  controllers: [MarcaController],
  providers: [PrismaService, MarcaRepository, MarcaService],
})
export class MarcaModule {}
