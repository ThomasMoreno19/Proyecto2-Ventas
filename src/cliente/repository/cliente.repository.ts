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
  async update(data: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.prisma.cliente.findFirst({
      where: { cuil: data.cuil },
    });

    if (!cliente || cliente.deletedAt) {
      throw new NotFoundException(`El cliente con cuil "${data.cuil}" no existe`);
    }

    // Desestructuramos y omitimos cuil de forma tipada (no as any)
    const { cuil, ...updateData } = data;

    // Opcional: normalizar/validar campos antes de persistir
    const payload = {
      ...updateData,
    };

    return this.prisma.cliente.update({
      where: { cuil: cuil },
      data: payload,
    });
  }

  // Soft-delete por cuil
  async softDelete(cuil: string): Promise<boolean> {
    const cliente = await this.prisma.cliente.findFirst({
      where: { cuil: cuil },
    });

    if (!cliente || cliente.deletedAt) {
      throw new NotFoundException(`El cliente con cuil "${cuil}" no existe`);
    }

    await this.prisma.cliente.update({
      where: { cuil: cliente.cuil },
      data: { deletedAt: new Date() },
    });
    return true;
  }
}
