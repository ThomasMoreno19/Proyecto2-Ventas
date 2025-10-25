/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VentaHelper {
  private readonly prisma: PrismaService;
  async validateCliente(cuil: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { cuil },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con CUIL ${cuil} no encontrado`);
    }
    return cliente;
  }

  // Helper: Validate user existence
  async validateUsuario(usuarioId: string) {
    const usuario = await this.prisma.user.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }
    return usuario;
  }

  // Helper: Validate products and their stock
  async validateProductosYStock(detalles: { productoId: string; cantidad: number }[]) {
    for (const detalle of detalles) {
      const producto = await this.prisma.product.findUnique({
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

  // Helper: Update product stock
  async actualizarStockProductos(
    detalles: { productoId: string; cantidad: number }[],
    prisma: any, // Use transaction client
  ) {
    for (const detalle of detalles) {
      await prisma.product.update({
        where: { id: detalle.productoId },
        data: {
          stock: {
            decrement: detalle.cantidad,
          },
          updatedAt: new Date(),
        },
      });
    }
  }
}
