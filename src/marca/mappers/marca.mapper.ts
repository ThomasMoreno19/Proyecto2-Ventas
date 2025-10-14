import { Marca } from '@prisma/client';
import { MarcaDto } from '../dto/marca.dto';

export function toMarcaDto(marca: Marca): MarcaDto {
  const { deletedAt, descripcion, logo, createdAt, updatedAt, ...rest } = marca;

  return {
    ...rest,
    descripcion: descripcion ?? undefined,
    logo: logo ?? undefined,
  };
}

