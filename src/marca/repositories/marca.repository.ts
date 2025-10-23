import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Marca } from '@prisma/client';
import { IMarcaRepository } from './marca.repository.interface';
import { CreateMarcaDto } from '../dto/create-marca.dto';
import { UpdateMarcaDto } from '../dto/update-marca.dto';

@Injectable()
export class MarcaRepository implements IMarcaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Crear una nueva marca
  async create(data: CreateMarcaDto): Promise<Marca> {
    return this.prisma.marca.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        deletedAt: null, // explícito
      },
    });
  }

  // Traer todas las marcas activas
  async findAll(): Promise<Marca[]> {
    const marcas = await this.prisma.marca.findMany();
    return marcas.filter((marca) => !marca.deletedAt);
  }

  // Buscar una marca por nombre
  async findById(nombre: string): Promise<Marca | null> {
    const marca = await this.prisma.marca.findFirst({
      where: { nombre },
    });

    if (!marca || marca.deletedAt) {
      return null;
    }

    return marca;
  }

  // Actualizar una marca por nombre
  async update(nombre: string, data: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.prisma.marca.findFirst({
      where: { nombre },
    });

    if (!marca || marca.deletedAt) {
      throw new NotFoundException(`La marca con nombre "${nombre}" no existe`);
    }

    return this.prisma.marca.update({
      where: { id: marca.id },
      data: {
        ...data,
      },
    });
  }

  // Soft-delete por nombre
  async softDelete(nombre: string): Promise<void> {
    const marca = await this.prisma.marca.findFirst({
      where: { nombre },
    });

    if (!marca || marca.deletedAt) {
      throw new NotFoundException(`La marca con nombre "${nombre}" no existe`);
    }

    await this.prisma.marca.update({
      where: { id: marca.id },
      data: { deletedAt: new Date() },
    });
  }
}
