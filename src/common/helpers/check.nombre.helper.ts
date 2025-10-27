import { BadRequestException } from '@nestjs/common';
import { Linea, Marca, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export async function checkUniqueName(
  prisma: PrismaService,
  model: 'marca' | 'linea' | 'product',
  nombre: string,
): Promise<void> {
  const cleanName = nombre.trim().toLowerCase();

  let exists: Marca | Linea | Product | null = null;

  if (model === 'marca') {
    exists = await prisma.marca.findFirst({
      where: { nombre: cleanName },
    });
  } else if (model === 'linea') {
    exists = await prisma.linea.findFirst({
      where: { nombre: cleanName },
    });
  } else if (model === 'product') {
    exists = await prisma.product.findFirst({
      where: { nombre: cleanName },
    });
  }

  if (exists) {
    throw new BadRequestException(`Ya existe una ${model} con el nombre "${nombre}"`);
  }
}
