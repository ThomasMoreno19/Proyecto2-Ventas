import { Venta, DetalleVenta, Product, Cliente } from '@prisma/client';
import { VentaDto } from '../dto/venta.dto';
import { CreateDetalleVentaDto } from '../dto/create-detalle-venta.dto';

export function toVentaDto(
  venta: Venta & {
    cliente: Cliente;
    detalleVenta: (DetalleVenta & { producto: Product })[];
  },
): VentaDto {
  const dto: VentaDto = {
    fecha: venta.fecha || new Date(),
    cuil: venta.cuil,
    usuarioId: venta.usuarioId,
    detalleVenta: venta.detalleVenta.map(toCreateCDetalleVentaDto),
  };

  return dto;
}

export function toCreateCDetalleVentaDto(
  detalleVenta: CreateDetalleVentaDto & { producto: Product },
): CreateDetalleVentaDto {
  return {
    productoId: detalleVenta.productoId,
    cantidad: detalleVenta.cantidad,
  };
}
