import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Verifica que el nombre sea único en la tabla especificada
export async function checkUniqueName(
  prisma: PrismaService,
  model: 'marca' | 'linea' | 'cliente',
  nombre: string,
) {
  const exists = await prisma.$transaction(async (tx) => {
    if (model === 'marca') {
      return tx.marca.findFirst({
        where: { nombre: nombre.trim().toLowerCase() },
      });
    }
<<<<<<< HEAD
    if (model === 'cliente') {
      return tx.cliente.findFirst({
        where: { nombre: nombre.trim().toLowerCase() },
      });
    }
=======
>>>>>>> 0ef94826c494c445fdbbee0e15304ee07878d50f
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
