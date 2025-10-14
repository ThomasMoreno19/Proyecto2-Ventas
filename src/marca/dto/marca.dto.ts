import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MarcaDto {
  @ApiProperty({ description: 'ID de la marca', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ description: 'Nombre de la marca', example: 'Nike' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre!: string;

  @ApiPropertyOptional({
    description: 'Descripción de la marca',
    example: 'Marca de ropa deportiva',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Logo de la marca',
    example: 'https://logo.com/nike.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2025-10-13T17:00:00.000Z',
  })
  @IsDate()
  updateAt!: Date;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-10-13T17:00:00.000Z',
  })
  @IsDate()
  createdAt!: Date;
}
