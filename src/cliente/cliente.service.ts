// src/cliente/cliente.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from './repository/cliente.repository';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { toClienteDto } from './mapper/cliente.mapper';
import { checkUniqueName } from 'src/common/helpers/check.nombre.helper';
import { PrismaService } from 'src/prisma/prisma.service';

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
      throw new NotFoundException(`cliente con nombre ${nombre} no encontrado`);
    }
    return toClienteDto(cliente);
  }

  async create(dto: CreateClienteDto): Promise<CreateClienteDto> {
    await checkUniqueName(this.prisma, 'cliente', dto.nombre);

    const cliente = await this.clienteRepository.create(dto);
    return toClienteDto(cliente);
  }

  async update(cuil: string, dto: UpdateClienteDto): Promise<CreateClienteDto> {
    const cliente = await this.clienteRepository.update(cuil, dto);
    return toClienteDto(cliente);
  }

  async softDelete(nombre: string): Promise<void> {
    await this.clienteRepository.softDelete(nombre);
  }
}
