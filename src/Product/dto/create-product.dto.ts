import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
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
  @IsNumber()
  precio!: number;
  @ApiProperty({
    example: 50,
    description: 'Cantidad en stock del producto',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stock!: number;
  @ApiProperty({
    example: 'marca-linea-123',
    description: 'ID de la marca y línea del producto',
    required: true,
  })
  @IsString()
  marcaXLineaId!: string;
}
