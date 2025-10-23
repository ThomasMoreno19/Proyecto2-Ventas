import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: 'producto-123',
    description: 'ID del producto',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'Laptop Dell XPS 13',
    description: 'Nombre del producto',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Una laptop ultradelgada con pantalla de 13 pulgadas',
    description: 'Descripción del producto',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1000,
    description: 'Precio del producto',
    required: true,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 50,
    description: 'Cantidad en stock del producto',
    required: true,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'marcaXLinea-123',
    description: 'ID de la marcaXLinea',
    required: false,
  })
  @IsOptional()
  @IsString()
  marcaXLineaId?: string;
}
