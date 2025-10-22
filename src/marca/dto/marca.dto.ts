<<<<<<< HEAD
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
=======
import { ApiProperty } from '@nestjs/swagger';
>>>>>>> 0ef94826c494c445fdbbee0e15304ee07878d50f

export class MarcaDto {
  @ApiProperty({
    example: '68f0602ae29a2c2e0ff28625',
    description: 'ID de la marca',
  })
  id: string;

  @ApiProperty({
    example: 'Nike',
    description: 'Nombre de la marca',
  })
  nombre: string;

  @ApiProperty({
    example: 'Marca de ropa deportiva',
    description: 'Descripción de la marca',
    required: false,
  })
  descripcion?: string;
<<<<<<< HEAD

  @ApiPropertyOptional({
    description: 'Logo de la marca',
    example: 'https://logo.com/nike.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;
=======
>>>>>>> 0ef94826c494c445fdbbee0e15304ee07878d50f
}
