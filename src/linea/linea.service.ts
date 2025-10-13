import { Injectable, NotFoundException } from '@nestjs/common';
import { LineaRepository } from './repositories/linea.repository';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { LineaDto } from './dto/linea.dto';
import {
  toLineaDto,
  toCreateEntity,
  toUpdateEntity,
} from './mappers/linea.mapper';

@Injectable()
export class LineaService {
  constructor(private readonly lineaRepository: LineaRepository) {}

  async findAll(): Promise<LineaDto[]> {
    const lineas = await this.lineaRepository.findAll();
    return lineas.map(toLineaDto);
  }

  async findById(id: number): Promise<LineaDto> {
    const linea = await this.lineaRepository.findById(id);
    if (!linea) {
      throw new NotFoundException(`Línea con id ${id} no encontrada`);
    }
    return toLineaDto(linea);
  }

  async create(dto: CreateLineaDto): Promise<LineaDto> {
    const entity = toCreateEntity(dto);
    const linea = await this.lineaRepository.create(entity);
    return toLineaDto(linea);
  }

  async update(id: number, dto: UpdateLineaDto): Promise<LineaDto> {
    const entity = toUpdateEntity(dto);
    const linea = await this.lineaRepository.update(id, entity);
    return toLineaDto(linea);
  }

  async softDelete(id: number): Promise<void> {
    await this.lineaRepository.softDelete(id);
  }
}
