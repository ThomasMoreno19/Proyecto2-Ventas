import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Marca, Prisma } from '@prisma/client';
import { IMarcaRepository } from './marca.repository.interface';

@Injectable()
export class MarcaRepository implements IMarcaRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.MarcaCreateInput): Promise<Marca> {
    return this.prisma.marca.create({ data });
  }

  findAll(): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      where: { deletedAt: null },
    });
  }

  findById(id: number): Promise<Marca | null> {
    return this.prisma.marca.findUnique({
      where: { id },
    });
  }

  update(id: number, data: Prisma.MarcaUpdateInput): Promise<Marca> {
    return this.prisma.marca.update({
      where: { id },
      data,
    });
  }

  softDelete(id: number): Promise<Marca> {
    return this.prisma.marca.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
