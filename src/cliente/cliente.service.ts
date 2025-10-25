// src/cliente/cliente.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from './repository/cliente.repository';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { toClienteDto } from './mapper/cliente.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ensureUniqueForCreate,
  ensureUniqueForUpdate,
  ensureExistsAndActive,
} from './helper/cliente.helper';
import { DeleteClienteDto } from './dto/delete-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    private readonly clienteRepository: ClienteRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<CreateClienteDto[]> {
    const clientes = await this.clienteRepository.findAll();
    return clientes.map(toClienteDto);
  }

  async findById(nombre: string): Promise<CreateClienteDto> {
    const cliente = await this.clienteRepository.findById(nombre);
    if (!cliente) {
      throw new NotFoundException(`cliente con cuil ${nombre} no encontrado`);
    }
    return toClienteDto(cliente);
  }

  async create(dto: CreateClienteDto): Promise<CreateClienteDto> {
    await ensureUniqueForCreate(this.prisma, dto);

    const cliente = await this.clienteRepository.create(dto);
    return toClienteDto(cliente);
  }

  async update(dto: UpdateClienteDto): Promise<CreateClienteDto> {
    dto.updatedAt = new Date();
    await ensureUniqueForUpdate(this.prisma, dto);

    const cliente = await this.clienteRepository.update(dto);
    return toClienteDto(cliente);
  }

  async softDelete(cuil: string): Promise<DeleteClienteDto> {
    await ensureExistsAndActive(this.prisma, cuil);
    return await this.clienteRepository.softDelete(cuil);
  }
}
