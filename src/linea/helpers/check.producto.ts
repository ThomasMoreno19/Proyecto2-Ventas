import { PrismaService } from 'src/prisma/prisma.service';

export async function canDelete(
  prisma: PrismaService,
  lineaId: string,
): Promise<boolean> {
  const productosCount = await prisma.product.count({
    where: { lineaId },
  });

  return productosCount === 0;
}
