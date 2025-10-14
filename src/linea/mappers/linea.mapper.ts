import { Linea } from '@prisma/client';
import { LineaDto } from '../dto/linea.dto';

export function toLineaDto(linea: Linea): LineaDto {
  const { deletedAt, descripcion, createdAt, updatedAt, ...rest } = linea;

  return {
    ...rest,
    descripcion: descripcion ?? undefined,
  };
}
