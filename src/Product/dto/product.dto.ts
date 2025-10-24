import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

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
    example: 'marcaXLinea-123',
    description: 'ID de la marcaXLinea',
    required: true,
  })
  @IsString()
  marcaXLineaId!: string;
}
