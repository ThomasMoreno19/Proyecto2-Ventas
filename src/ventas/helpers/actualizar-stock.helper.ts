import { PrismaService } from "src/prisma/prisma.service";

// Helper: Update product stock
export async function disminuirStock(
  prisma: PrismaService,
  detalles: { productoId: string; cantidad: number }[],
) {
  for (const detalle of detalles) {
      const producto = await prisma.product.findUnique({
      where: { id: detalle.productoId },
      select: {stock: true},
    });
  
    if (!producto) {
      throw new Error(`Producto con id ${detalle.productoId} no encontrado`);
    }

    // Calcular el nuevo stock
    const nuevoStock = producto.stock - detalle.cantidad;

    // Actualizar el valor en la base de datos
    await prisma.product.update({
      where: { id: detalle.productoId },
      data: { stock: nuevoStock },
    });
  }
}

export async function aumentarStock(prisma: PrismaService, idVenta: string) {
  const detalles = await prisma.detalleVenta.findMany({
    where: { ventaId: idVenta },
    select: { productoId: true, cantidad: true },
  })
  for (const detalle of detalles) {
      const producto = await prisma.product.findUnique({
      where: { id: detalle.productoId },
      select: {stock: true},
    });
  
    if (!producto) {
      throw new Error(`Producto con id ${detalle.productoId} no encontrado`);
    }

    // Calcular el nuevo stock
    const nuevoStock = producto.stock + detalle.cantidad;

    // Actualizar el valor en la base de datos
    await prisma.product.update({
      where: { id: detalle.productoId },
      data: { stock: nuevoStock },
    });
  }
}

export async function actualizarStockProductos(
  prisma: PrismaService,
  detalles: { productoId: string; cantidad: number }[],
  idVenta: string,
) {
  for (const detalle of detalles) {
    // Buscar el detalle de venta anterior
    const detalleViejo = await prisma.detalleVenta.findFirst({
      where: { productoId: detalle.productoId, ventaId: idVenta },
      select: { cantidad: true },
    });

    if (!detalleViejo) {
      throw new Error(
        `No se encontró el detalle de venta del producto ${detalle.productoId} en la venta ${idVenta}`,
      );
    }

    // Calcular la diferencia de cantidades
    const diferencia = detalle.cantidad - detalleViejo.cantidad;

    // Actualizar el detalle de venta con la nueva cantidad
    await prisma.detalleVenta.updateMany({
      where: { productoId: detalle.productoId, ventaId: idVenta },
      data: { cantidad: detalle.cantidad },
    });

    // Actualizar el stock del producto (restando o sumando según la diferencia)
    const producto = await prisma.product.findUnique({
      where: { id: detalle.productoId },
      select: { stock: true },
    });

    if (!producto) {
      throw new Error(`Producto con id ${detalle.productoId} no encontrado`);
    }

    await prisma.product.update({
      where: { id: detalle.productoId },
      data: { stock: producto.stock - diferencia },
    });
  }
}
