import { ApiProperty } from '@nestjs/swagger';

export class MarcaDto {
  @ApiProperty({
    example: '68f0602ae29a2c2e0ff28625',
    description: 'ID de la marca',
  })
  id!: string;

  @ApiProperty({
    example: 'Nike',
    description: 'Nombre de la marca',
  })
  nombre!: string;

  @ApiProperty({
    example: 'Marca de ropa deportiva',
    description: 'Descripción de la marca',
    required: false,
  })
  descripcion?: string;

  @ApiProperty({
    example: '2023-11-01T10:00:00.000Z',
    description: 'Fecha de eliminación de la marca (soft delete)',
    required: false,
  })
  deletedAt?: Date | null;
}
