import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';

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

  @ApiProperty({
    example: ['68f0602ae29a2c2e0ff28625', '78g1703bf30b3d3f1gg39736'],
    description: 'IDs de las marcas asociadas a esta línea',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  marcaIds?: string[];
}
