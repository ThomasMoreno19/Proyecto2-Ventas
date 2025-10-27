import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  @ApiProperty({
    example: 'producto-123',
    description: 'ID del producto',
    required: true,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    example: 'Laptop Dell XPS 13',
    description: 'Nombre del producto',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 'Una laptop ultradelgada con pantalla de 13 pulgadas',
    description: 'Descripción del producto',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    example: 1000,
    description: 'Precio del producto',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  @IsNumber()
  precio!: number;

  @ApiProperty({
    example: 50,
    description: 'Cantidad en stock del producto',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
  @IsNumber()
  stock!: number;

  @ApiProperty({
    example: 'marcaXLinea-123',
    description: 'ID de la marcaXLinea',
    required: true,
  })
  @IsString()
  marcaXLineaId!: string;
}
