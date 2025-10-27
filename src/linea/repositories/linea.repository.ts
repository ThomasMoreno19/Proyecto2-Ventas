import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLineaDto } from '../dto/create-linea.dto';
import { UpdateLineaDto } from '../dto/update-linea.dto';
import { ILineaRepository } from './linea.repository.interface';
import { Linea } from '@prisma/client';

@Injectable()
export class LineaRepository implements ILineaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Trae todas las líneas activas (deletedAt no existe o es null)
  async findAll(): Promise<Linea[]> {
    const lineas = await this.prisma.linea.findMany();
    return lineas.filter((linea) => !linea.deletedAt);
  }

  // Busca una línea por nombre, solo si está activa
  async findById(nombre: string): Promise<Linea | null> {
    const linea = await this.prisma.linea.findFirst({
      where: { nombre },
    });

    if (!linea || linea.deletedAt) {
      return null;
    }
    return linea;
  }

  async findMarcasByLinea(nombre: string): Promise<
    | (Linea & {
        marcasLineas: { marca: { id: string; nombre: string; descripcion: string | null } }[];
      })
    | null
  > {
    return this.prisma.linea.findUnique({
      where: { nombre },
      include: {
        marcasLineas: {
          include: {
            marca: true, // trae los datos de la marca
          },
        },
      },
    });
  }

  // Crea una nueva línea
  async create(data: CreateLineaDto): Promise<Linea> {
    return this.prisma.linea.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        deletedAt: null, // opcional, pero explícito
      },
    });
  }

  // Actualiza una línea existente por nombre, solo si está activa
  async update(nombre: string, data: UpdateLineaDto): Promise<Linea> {
    const linea = await this.prisma.linea.findFirst({
      where: { nombre },
    });

    if (!linea || linea.deletedAt) {
      throw new NotFoundException(`La línea con nombre "${nombre}" no existe`);
    }

    return this.prisma.linea.update({
      where: { id: linea.id },
      data: {
        ...data,
      },
    });
  }

  // Soft-delete: marca deletedAt con la fecha actual
  async softDelete(id: string): Promise<void> {
    const linea = await this.prisma.linea.findUnique({ where: { id } });

    if (!linea || linea.deletedAt) {
      throw new NotFoundException(`La línea con id "${id}" no existe`);
    }

    await this.prisma.linea.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
