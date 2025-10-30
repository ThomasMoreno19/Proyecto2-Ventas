import { Marca } from '@prisma/client';
import { MarcaDto } from '../dto/marca.dto';

export function toMarcaDto(marca: Marca): MarcaDto {
  const dto: MarcaDto = {
    id: marca.id,
    nombre: marca.nombre,
    descripcion: marca.descripcion ?? undefined,
  };

  return dto;
}