import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Cliente } from '@prisma/client';

export async function ensureUniqueForCreate(
  prisma: PrismaService,
  dto: CreateClienteDto,
): Promise<void> {
  const whereOr = [{ cuil: dto.cuil }, dto.email ? { email: dto.email } : undefined].filter(
    (v): v is { cuil: string } | { email: string } => v !== undefined && v !== null,
  );

  const existing = await prisma.cliente.findFirst({
    where: {
      OR: whereOr,
    },
  });

  if (existing) {
    if (existing.cuil === dto.cuil) {
      throw new BadRequestException(`Ya existe un cliente con el mismo CUIL.`);
    }
    if (dto.email && existing.email === dto.email) {
      throw new BadRequestException(`Ya existe un cliente con el mismo email.`);
    }
    throw new BadRequestException(`Ya existe un cliente con datos duplicados.`);
  }
}

export async function ensureUniqueForUpdate(
  prisma: PrismaService,
  dto: UpdateClienteDto,
): Promise<void> {
  const or: any[] = [];
  if (dto.cuil) or.push({ cuil: dto.cuil });
  if (dto.email) or.push({ email: dto.email });
  if (or.length === 0) return;

  const existing = await prisma.cliente.findFirst({
    where: {
      OR: or,
      cuil: { not: dto.cuil },
    },
  });

  if (existing) {
    if (dto.cuil && existing.cuil === dto.cuil) {
      throw new BadRequestException(`No se puede actualizar: otro cliente ya tiene ese CUIL.`);
    }
    if (dto.email && existing.email === dto.email) {
      throw new BadRequestException(`No se puede actualizar: otro cliente ya tiene ese email.`);
    }
    throw new BadRequestException(`No se puede actualizar: conflicto de datos con otro cliente.`);
  }
}

export async function ensureExistsAndActive(prisma: PrismaService, cuil: string): Promise<Cliente> {
  const cliente = await prisma.cliente.findFirst({ where: { cuil } });
  if (!cliente || cliente.deletedAt) {
    throw new NotFoundException(`El cliente con cuil "${cuil}" no existe.`);
  }
  return cliente;
}
