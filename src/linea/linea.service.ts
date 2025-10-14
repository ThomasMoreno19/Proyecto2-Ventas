import { Injectable, NotFoundException } from '@nestjs/common';
import { LineaRepository } from './repositories/linea.repository';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { LineaDto } from './dto/linea.dto';
import { toLineaDto} from './mappers/linea.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkUniqueName } from 'src/common/helpers/check.nombre.helper';

@Injectable()
export class LineaService {
  constructor(
      private readonly lineaRepository: LineaRepository,
      private readonly prisma: PrismaService
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
    return toLineaDto(linea);
  }

  async update(nombre: string, dto: UpdateLineaDto): Promise<LineaDto> {
    const linea = await this.lineaRepository.update(nombre, dto);
    return toLineaDto(linea);
  }

  async softDelete(nombre: string): Promise<void> {
    await this.lineaRepository.softDelete(nombre);
  }
}
