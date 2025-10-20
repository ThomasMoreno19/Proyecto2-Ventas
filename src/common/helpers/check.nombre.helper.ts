import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Verifica que el nombre sea único en la tabla especificada
export async function checkUniqueName(
  prisma: PrismaService,
  model: 'marca' | 'linea',
  nombre: string,
) {
  const exists = await prisma.$transaction(async (tx) => {
    if (model === 'marca') {
      return tx.marca.findFirst({
        where: { nombre: nombre.trim().toLowerCase() },
      });
    }
    return tx.linea.findFirst({
      where: { nombre: nombre.trim().toLowerCase() },
    });
  });

  if (exists) {
    throw new BadRequestException(
      `Ya existe una ${model} con el nombre "${nombre}"`,
    );
  }
}
