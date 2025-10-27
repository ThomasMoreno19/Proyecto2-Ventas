import { Venta, DetalleVenta, Product, Cliente, User } from '@prisma/client';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { CreateDetalleVentaDto } from '../dto/create-detalle-venta.dto';

export function toVentaDto(
  venta: Venta & {
    cliente: Cliente;
    usuario: User;
    detalleVenta: (DetalleVenta & { producto: Product })[];
  },
): CreateVentaDto {
  const dto: CreateVentaDto = {
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
    precioUnitario: detalleVenta.precioUnitario,
  };
}

/*function calcularTotal(detalleVenta: (DetalleVenta & { producto: Product })[]): number {
  return detalleVenta.reduce((total, detalle) => {
    return total + detalle.cantidad * detalle.precioUnitario;
  }, 0);
}*/
