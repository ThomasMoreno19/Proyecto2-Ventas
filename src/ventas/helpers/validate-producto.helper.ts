import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

export async function validateProductosYStock(
  prisma: PrismaService,
  detalles: { productoId: string; cantidad: number }[],
) {
  for (const detalle of detalles) {
    const producto = await prisma.product.findUnique({
      where: { id: detalle.productoId },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${detalle.productoId} no encontrado`);
    }
    if (producto.stock < detalle.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para el producto ${producto.nombre}. Stock disponible: ${producto.stock}, solicitado: ${detalle.cantidad}`,
      );
    }
  }
}
