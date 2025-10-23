import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Verifica que el nombre sea único en la tabla especificada (marca o linea)
export async function checkUniqueName(
  prisma: PrismaService,
  model: 'marca' | 'linea' | 'product',
  nombre: string,
) {
  const exists = await (prisma as any)[model].findFirst({
    where: { nombre: nombre.trim().toLowerCase() },
  });

  if (exists) {
    throw new BadRequestException(
      `Ya existe una ${model} con el nombre "${nombre}"`,
    );
  }
}
