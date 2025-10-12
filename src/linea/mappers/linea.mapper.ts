import { Linea } from '@prisma/client';
import { LineaDto } from '../dto/linea.dto';
import { CreateLineaDto } from '../dto/create-linea.dto';
import { UpdateLineaDto } from '../dto/update-linea.dto';

export function toLineaDto(linea: Linea): LineaDto {
  const { deletedAt, descripcion, ...rest } = linea;

  return {
    ...rest,
    descripcion: descripcion ?? undefined,
  };
}

export function toCreateEntity(dto: CreateLineaDto) {
  return { ...dto };
}

export function toUpdateEntity(dto: UpdateLineaDto) {
  return { ...dto };
}
