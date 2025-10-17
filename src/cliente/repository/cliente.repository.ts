import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cliente } from '@prisma/client';
import { IClienteRepository } from './cliente.repository.interface';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Crear una nueva cliente
  async create(data: CreateClienteDto): Promise<Cliente> {
    return await this.prisma.cliente.create({
      data: {
        cuil: data.cuil,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        email: data.email,
        deletedAt: null,
      },
    });
  }

  // Traer todas las clientes activas
  async findAll(): Promise<Cliente[]> {
    const clientes = await this.prisma.cliente.findMany();
    return clientes.filter((cliente) => !cliente.deletedAt);
  }

  // Buscar una cliente por nombre
  async findById(cuil: string): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findFirst({
      where: { cuil },
    });

    if (!cliente || cliente.deletedAt) {
      return null;
    }

    return cliente;
  }

  // Actualizar una cliente por nombre
  async update(cuil: string, data: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.prisma.cliente.findFirst({
      where: { cuil },
    });

    if (!cliente || cliente.deletedAt) {
      throw new NotFoundException(`El cliente con cuil "${cuil}" no existe`);
    }

    return this.prisma.cliente.update({
      where: { cuil: cliente.cuil },
      data: {
        ...data,
      },
    });
  }

  // Soft-delete por nombre
  async softDelete(cuil: string): Promise<void> {
    const cliente = await this.prisma.cliente.findFirst({
      where: { cuil },
    });

    if (!cliente || cliente.deletedAt) {
      throw new NotFoundException(`El cliente con cuil "${cuil}" no existe`);
    }

    await this.prisma.cliente.update({
      where: { cuil: cliente.cuil },
      data: { deletedAt: new Date() },
    });
  }
}
