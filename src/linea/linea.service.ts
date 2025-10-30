import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LineaRepository } from './repositories/linea.repository';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { LineaDto } from './dto/linea.dto';
import { toLineaDto } from './mappers/linea.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { checkUniqueName } from '../common/helpers/check.nombre.helper';
import { canDelete } from './helpers/check.producto';
import { asociarMarcas } from './helpers/marcaxlinea.helper';

@Injectable()
export class LineaService {
  constructor(
    private readonly lineaRepository: LineaRepository,
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

  async update(nombre: string, dto: UpdateLineaDto) {
    const linea = await this.prisma.linea.findUnique({ where: { nombre } });
    if (!linea) throw new NotFoundException(`No se encontró la línea '${nombre}'.`);

    const updatedLinea = await this.lineaRepository.update(nombre, dto);

    if (dto.marcaIds?.length) {
      await asociarMarcas({
        prisma: this.prisma,
        lineaId: linea.id,
        marcaIds: dto.marcaIds,
      });
    }

    return toLineaDto(updatedLinea);
  }

  async softDelete(nombre: string): Promise<void> {
    const linea = await this.lineaRepository.findById(nombre);
    if (!linea) {
      throw new NotFoundException(`La línea "${nombre}" no existe.`);
    }

    const canDeleteLinea = await canDelete(this.prisma, linea.id);

    if (!canDeleteLinea) {
      throw new BadRequestException(
        'No se puede eliminar la línea porque tiene productos asociados.',
      );
    }

    await this.lineaRepository.softDelete(nombre);
  }

  async getMarcasPorLinea(nombre: string) {
    const linea = await this.lineaRepository.findMarcasByLinea(nombre);

    if (!linea) {
      throw new NotFoundException(`No existe la línea "${nombre}"`);
    }

    return linea.marcasLineas.map((ml) => ml.marca);
  }
}
