import { PrismaService } from 'src/prisma/prisma.service';

export async function canDelete(prisma: PrismaService, marcaId: string): Promise<boolean> {
  const productosCount = await prisma.product.count({
    where: { marcaXLinea: { is: { marcaId } } },
  });

  return productosCount === 0;
}
