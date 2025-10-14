// src/marca/marca.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MarcaRepository } from './repositories/marca.repository';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaDto } from './dto/marca.dto';
import { toMarcaDto } from './mappers/marca.mapper';
import { checkUniqueName } from 'src/common/helpers/check.nombre.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarcaService {
  constructor(
    private readonly marcaRepository: MarcaRepository,
    private readonly prisma: PrismaService
  ) {}

  async findAll(): Promise<MarcaDto[]> {
    const marcas = await this.marcaRepository.findAll();
    return marcas.map(toMarcaDto);
  }

  async findById(nombre: string): Promise<MarcaDto> {
    const marca = await this.marcaRepository.findById(nombre);
    if (!marca) {
      throw new NotFoundException(`Marca con nombre ${nombre} no encontrada`);
    }
    return toMarcaDto(marca);
  }

  async create(dto: CreateMarcaDto): Promise<MarcaDto> {
    await checkUniqueName(this.prisma, 'marca', dto.nombre);

    const marca = await this.marcaRepository.create(dto);
    return toMarcaDto(marca);
  }

  async update(nombre: string, dto: UpdateMarcaDto): Promise<MarcaDto> {
    const marca = await this.marcaRepository.update(nombre, dto);
    return toMarcaDto(marca);
  }

  async softDelete(nombre: string): Promise<void> {
    await this.marcaRepository.softDelete(nombre);
  }
}
