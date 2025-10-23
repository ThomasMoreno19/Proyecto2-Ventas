import { ApiProperty } from '@nestjs/swagger';

export class CreateLineaDto {
  @ApiProperty({
    example: 'Ropa deportiva',
    description: 'Nombre de la línea',
    required: true,
  })
  nombre: string;

  @ApiProperty({
    example: 'Ropa para hacer deporte',
    description: 'Descripción de la línea',
    required: false,
  })
  descripcion?: string;
}
