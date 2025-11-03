import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaDto } from './dto/marca.dto';
import { toMarcaDto } from './mappers/marca.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { HelperMarca } from './helpers/marca.helper';
import { IMarcaRepository } from './repositories/marca.repository.interface';

@Injectable()
export class MarcaService {
  constructor(
    @Inject('IMarcaRepository') private readonly marcaRepository: IMarcaRepository,
    private readonly prisma: PrismaService,
    private readonly helperMarca: HelperMarca,
  ) {}

  async findAll(): Promise<MarcaDto[]> {
    const marcas = await this.marcaRepository.findAll();
    return marcas.map(toMarcaDto);
  }

  async findByName(nombre: string): Promise<MarcaDto> {
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

  async getMarcaXLineas(nombre: string) {
    const marcaXLineas = await this.helperMarca.findByMarcaXLineas(nombre);

    return marcaXLineas;
  }

  async update(id: string, dto: UpdateMarcaDto): Promise<MarcaDto> {
    const marca = await this.marcaRepository.update(id, dto);
    return toMarcaDto(marca);
  }

  async softDelete(id: string): Promise<boolean> {
    const marca = await this.marcaRepository.findById(id);
    if (!marca) {
      throw new NotFoundException(`La marca con id ${id} no existe.`);
    }

    const canDeleteMarca = await this.helperMarca.canDelete(this.prisma, marca.id);

    if (!canDeleteMarca) {
      throw new BadRequestException(
        'No se puede eliminar la marca porque tiene productos asociados.',
      );
    }

    return await this.marcaRepository.softDelete(id);
  }
}
