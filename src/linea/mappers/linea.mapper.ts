import { Linea } from '@prisma/client';
import { LineaDto } from '../dto/linea.dto';

export function toLineaDto(linea: Linea): LineaDto {
  const dto: LineaDto = {
    id: linea.id,
    nombre: linea.nombre,
    descripcion: linea.descripcion ?? undefined,
  };

  return dto;
}
