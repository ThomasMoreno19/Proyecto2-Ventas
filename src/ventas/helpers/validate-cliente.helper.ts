import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cliente } from '@prisma/client';

export async function validateCliente(prisma: PrismaService, cuil: string): Promise<Cliente> {
  if (cuil) {
    const cliente = await prisma.cliente.findUnique({
      where: { cuil, deletedAt: null },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con CUIL ${cuil} no encontrado`);
    }
    return cliente;
  }
}
