import { PrismaService } from 'src/prisma/prisma.service';

export async function canDelete(prisma: PrismaService, lineaId: string): Promise<boolean> {
  // Buscar productos cuya marcaXLinea referencie la linea
  const productosCount = await prisma.product.count({
    where: { marcaXLinea: { is: { lineaId } } },
  });

  return productosCount === 0;
}
