import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MarcaXLineaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(data: { marcaId: string; lineaId: string }[]) {
    if (!data.length) return;

    // Crear directamente. La validación de duplicados la maneja el helper.
    return this.prisma.marcaXLinea.createMany({ data });
  }
}
