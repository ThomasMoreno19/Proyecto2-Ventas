import { ApiProperty } from '@nestjs/swagger';

export class CreateMarcaDto {
  @ApiProperty({
    example: 'Nike',
    description: 'Nombre de la marca',
    required: true,
  })
  nombre: string;

  @ApiProperty({
    example: 'Marca de ropa deportiva',
    description: 'Descripción de la marca',
    required: false,
  })
  descripcion?: string;
}
