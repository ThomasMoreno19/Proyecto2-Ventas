// src/marca/marca.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MarcaRepository } from './repositories/marca.repository';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaDto } from './dto/marca.dto';
import {
  toMarcaDto,
  toCreateEntity,
  toUpdateEntity,
} from './mappers/marca.mapper';

@Injectable()
export class MarcaService {
  constructor(private readonly marcaRepository: MarcaRepository) {}

  async findAll(): Promise<MarcaDto[]> {
    const marcas = await this.marcaRepository.findAll();
    return marcas.map(toMarcaDto);
  }

  async findById(id: number): Promise<MarcaDto> {
    const marca = await this.marcaRepository.findById(id);
    if (!marca) {
      throw new NotFoundException(`Marca con id ${id} no encontrada`);
    }
    return toMarcaDto(marca);
  }

  async create(dto: CreateMarcaDto): Promise<MarcaDto> {
    const entity = toCreateEntity(dto);
    const marca = await this.marcaRepository.create(entity);
    return toMarcaDto(marca);
  }

  async update(id: number, dto: UpdateMarcaDto): Promise<MarcaDto> {
    const entity = toUpdateEntity(dto);
    const marca = await this.marcaRepository.update(id, entity);
    return toMarcaDto(marca);
  }

  async softDelete(id: number): Promise<void> {
    await this.marcaRepository.softDelete(id);
  }
}
