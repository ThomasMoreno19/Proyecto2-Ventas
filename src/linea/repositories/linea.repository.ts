import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLineaDto } from '../dto/create-linea.dto';
import { UpdateLineaDto } from '../dto/update-linea.dto';
import { ILineaRepository } from './linea.repository.interface';

@Injectable()
export class LineaRepository implements ILineaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.linea.findMany({
      where: { deletedAt: null },
    });
  }

  async findById(id: number) {
    return this.prisma.linea.findUnique({
      where: { id },
    });
  }

  async create(data: CreateLineaDto) {
    return this.prisma.linea.create({ data });
  }

  async update(id: number, data: UpdateLineaDto) {
    return this.prisma.linea.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.prisma.linea.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
