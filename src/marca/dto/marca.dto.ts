import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MarcaDto {
  id: string;
  nombre: string;
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Logo de la marca',
    example: 'https://logo.com/nike.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;
}
