import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MarcaRepository } from './repositories/marca.repository';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaDto } from './dto/marca.dto';
import { toMarcaDto } from './mappers/marca.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { HelperMarca } from './helpers/marca.helper';

@Injectable()
export class MarcaService {
  constructor(
    private readonly marcaRepository: MarcaRepository,
    private readonly prisma: PrismaService,
    private readonly helperMarca: HelperMarca,
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
    const existingMarca = await this.marcaRepository.findMarca(dto.nombre);

    if (existingMarca) {
      return toMarcaDto(await this.helperMarca.reactivate(existingMarca, dto));
    }

    const marca = await this.marcaRepository.create(dto);
    return toMarcaDto(marca);
  }

  async update(nombre: string, dto: UpdateMarcaDto): Promise<MarcaDto> {
    const marca = await this.marcaRepository.update(nombre, dto);
    return toMarcaDto(marca);
  }

  async softDelete(nombre: string): Promise<void> {
    const marca = await this.marcaRepository.findById(nombre);
    if (!marca) {
      throw new NotFoundException(`La marca "${nombre}" no existe.`);
    }

    const canDeleteMarca = await this.helperMarca.canDelete(this.prisma, marca.id);

    if (!canDeleteMarca) {
      throw new BadRequestException(
        'No se puede eliminar la marca porque tiene productos asociados.',
      );
    }

    await this.marcaRepository.softDelete(nombre);
  }
}
