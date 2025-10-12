import { Module } from '@nestjs/common';
import { LineaService } from './linea.service';
import { LineaRepository } from './repositories/linea.repository';
import { PrismaService } from '../prisma/prisma.service';
import { LineaController } from './linea.controller';

@Module({
  imports: [],
  controllers: [LineaController],
  providers: [
    PrismaService,
    LineaRepository,
    LineaService,
  ],
})
export class LineaModule {}
