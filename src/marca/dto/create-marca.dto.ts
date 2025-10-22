<<<<<<< HEAD
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMarcaDto {
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '',
  )
  @ApiProperty({ description: 'Nombre de la marca', example: 'Nike' })
  @MaxLength(255)
  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'La denominación sólo puede tener letras, números y espacios',
  })
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
    description: 'URL del logo de la marca',
    example: 'https://logo.com/nike.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;
=======
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
>>>>>>> 0ef94826c494c445fdbbee0e15304ee07878d50f
}
