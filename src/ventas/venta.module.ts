import { Module } from '@nestjs/common';
import { VentaRepository } from './repository/venta.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';

@Module({
  imports: [],
  controllers: [VentasController],
  providers: [VentasService, VentaRepository, PrismaService],
})
export class VentaModule {}
