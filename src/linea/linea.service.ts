import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { LineaDto } from './dto/linea.dto';
import { toLineaDto } from './mappers/linea.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { checkUniqueName } from '../common/helpers/check.nombre.helper';
import { canDelete } from './helpers/check.producto';
import { asociarMarcas } from './helpers/asociar-marcas';
import { ILineaRepository } from './repositories/linea.repository.interface';

@Injectable()
export class LineaService {
  constructor(
    @Inject('ILineaRepository') private readonly lineaRepository: ILineaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<LineaDto[]> {
    const lineas = await this.lineaRepository.findAll();
    return lineas.map(toLineaDto);
  }

  async findById(nombre: string): Promise<LineaDto> {
    const linea = await this.lineaRepository.findById(nombre);
    if (!linea) {
      throw new NotFoundException(`Línea con nombre ${nombre} no encontrada`);
    }
    return toLineaDto(linea);
  }

  async create(dto: CreateLineaDto): Promise<LineaDto> {
    await checkUniqueName(this.prisma, 'linea', dto.nombre);
    const linea = await this.lineaRepository.create(dto);
    await asociarMarcas({
      prisma: this.prisma,
      lineaId: linea.id,
      marcaIds: dto.marcaIds,
    });

    return toLineaDto(linea);
  }

  async update(id: string, dto: UpdateLineaDto) {
    const linea = await this.lineaRepository.findById(id);
    if (!linea) throw new NotFoundException(`No se encontró la línea '${id}'.`);

    const updatedLinea = await this.lineaRepository.update(id, dto);

    if (dto.marcaIds?.length) {
      await asociarMarcas({
        prisma: this.prisma,
        lineaId: linea.id,
        marcaIds: dto.marcaIds,
      });
    }

    return toLineaDto(updatedLinea);
  }

  async softDelete(id: string): Promise<boolean> {
    const linea = await this.lineaRepository.findById(id);
    if (!linea) {
      throw new NotFoundException(`La línea "${id}" no existe.`);
    }

    const canDeleteLinea = await canDelete(this.prisma, linea.id);

    if (!canDeleteLinea) {
      throw new BadRequestException(
        'No se puede eliminar la línea porque tiene productos asociados.',
      );
    }

    return await this.lineaRepository.softDelete(id);
  }
}
