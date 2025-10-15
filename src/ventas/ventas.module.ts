import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { PrismaVentaRepository } from './repository/venta.repository';

@Module({
  controllers: [VentasController],
  providers: [
    VentasService,
    { provide: 'VentaRepository', useClass: PrismaVentaRepository },
  ],
  exports: [VentasService],
})
export class VentasModule {}
