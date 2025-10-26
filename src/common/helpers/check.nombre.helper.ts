import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export async function checkUniqueName(
  prisma: PrismaService,
  model: 'marca' | 'linea' | 'product',
  nombre: string,
) {
  const cleanName = nombre.trim().toLowerCase();

  const exists =
    model === 'marca'
      ? await prisma.marca.findFirst({
          where: { nombre: cleanName },
        })
      : await prisma.linea.findFirst({
          where: { nombre: cleanName },
        });

  if (exists) {
    throw new BadRequestException(
      `Ya existe una ${model} con el nombre "${nombre}"`,
    );
  }
}
