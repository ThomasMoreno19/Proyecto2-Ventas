import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface AsociarMarcasParams {
  prisma: PrismaService;
  lineaId: string;
  marcaIds?: string[];
}

export async function asociarMarcas({
  prisma,
  lineaId,
  marcaIds,
}: AsociarMarcasParams): Promise<void> {
  if (!marcaIds?.length) return;

  // Buscar marcas válidas
  const marcasExistentes = (await prisma.marca.findMany({
    where: { id: { in: marcaIds } },
    select: { id: true },
  })) as Array<{ id: string }>;

  const idsValidos = marcasExistentes.map((m) => m.id);
  const idsInvalidos = marcaIds.filter((id) => !idsValidos.includes(id));

  if (idsInvalidos.length > 0) {
    throw new BadRequestException(
      `Las siguientes marcas no existen: ${idsInvalidos.join(', ')}`,
    );
  }

  // Buscar relaciones existentes
  const relacionesExistentes = (await prisma.marcaXLinea.findMany({
    where: { lineaId, marcaId: { in: idsValidos } },
    select: { marcaId: true },
  })) as Array<{ marcaId: string }>;

  const nuevasRelaciones = idsValidos
    .filter((id) => !relacionesExistentes.some((rel) => rel.marcaId === id))
    .map((id) => ({ lineaId, marcaId: id }));

  if (nuevasRelaciones.length === 0) return;

  await prisma.marcaXLinea.createMany({
    data: nuevasRelaciones,
  });
}
