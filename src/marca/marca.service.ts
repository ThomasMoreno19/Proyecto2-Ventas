import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MarcaRepository } from './repositories/marca.repository';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaDto } from './dto/marca.dto';
import { toMarcaDto } from './mappers/marca.mapper';
import { checkUniqueName } from '../common/helpers/check.nombre.helper';
import { PrismaService } from '../prisma/prisma.service';
import { canDelete } from './helpers/check.producto';

@Injectable()
export class MarcaService {
  constructor(
    private readonly marcaRepository: MarcaRepository,
    private readonly prisma: PrismaService,
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
    try {
      await checkUniqueName(this.prisma, 'marca', dto.nombre);
      const marca = await this.marcaRepository.create(dto);
      return toMarcaDto(marca);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const anyError = error as { code?: string }; // Safe type assertion
      if (anyError.code === 'P2002') {
        throw new BadRequestException(`Ya existe una marca con el nombre "${dto.nombre}"`);
      }
      throw new InternalServerErrorException('Error al crear la marca');
    }
  }

  async update(id: string, dto: UpdateMarcaDto): Promise<MarcaDto> {
    const marca = await this.marcaRepository.update(id, dto);
    return toMarcaDto(marca);
  }

  async softDelete(id: string): Promise<void> {
    const marca = await this.marcaRepository.findById(id);
    if (!marca) {
      throw new NotFoundException(`La marca con id ${id} no existe.`);
    }

    const canDeleteMarca = await canDelete(this.prisma, marca.id);

    if (!canDeleteMarca) {
      throw new BadRequestException(
        'No se puede eliminar la marca porque tiene productos asociados.',
      );
    }

    await this.marcaRepository.softDelete(id);
  }
}
