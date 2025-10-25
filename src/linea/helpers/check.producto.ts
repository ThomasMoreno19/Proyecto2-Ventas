import { PrismaService } from '../../prisma/prisma.service';

export async function canDelete(prisma: PrismaService, lineaId: string): Promise<boolean> {
  // 1. Buscar la relación MarcaXLinea
  const marcaXLinea = await prisma.marcaXLinea.findFirst({
    where: { lineaId },
  });

  if (!marcaXLinea) return true;

  // 2. Buscar todos los productos y filtrar en memoria
  const productos = await prisma.product.findMany({
    select: { id: true, marcaXLineaId: true }, // solo traemos ID y FK
  });

  const asociados = productos.filter((p) => p.marcaXLineaId === marcaXLinea.id);

  return asociados.length === 0;
}
