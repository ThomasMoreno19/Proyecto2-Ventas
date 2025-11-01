import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

export async function validateUsuario(prisma: PrismaService, usuarioId: string): Promise<User> {
  const usuario = await prisma.user.findUnique({
    where: { id: usuarioId },
  });
  if (!usuario) {
    throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
  }
  return usuario;
}