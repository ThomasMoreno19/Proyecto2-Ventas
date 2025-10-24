import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class LineaDto {
  @ApiProperty({
    example: '68f0602ae29a2c2e0ff28625',
    description: 'ID de la línea',
  })
  id!: string;

  @ApiProperty({
    example: 'Ropa deportiva',
    description: 'Nombre de la línea',
  })
  nombre!: string;

  @ApiProperty({
    example: 'Ropa para hacer deporte',
    description: 'Descripción de la línea',
  })
  descripcion?: string;
}
