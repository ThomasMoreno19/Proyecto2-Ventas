import { Marca } from '@prisma/client';
import { MarcaDto } from '../dto/marca.dto';
import { CreateMarcaDto } from '../dto/create-marca.dto';
import { UpdateMarcaDto } from '../dto/update-marca.dto';

export function toMarcaDto(marca: Marca): MarcaDto {
  const { deletedAt, descripcion, logo, ...rest } = marca;

  return {
    ...rest,
    descripcion: descripcion ?? undefined,
    logo: logo ?? undefined,
  };
}

// ✅ Para creación: no seteamos timestamps manualmente
export function toCreateEntity(dto: CreateMarcaDto) {
  return {
    ...dto,
  };
}

// ✅ Para update: solo dejamos lo modificable
export function toUpdateEntity(dto: UpdateMarcaDto) {
  return {
    ...dto,
  };
}
