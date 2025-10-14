import { PartialType } from '@nestjs/mapped-types';
import { MarcaDto } from './marca.dto';
import { IsOptional, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteMarcaDto extends PartialType(MarcaDto) {
  @ApiPropertyOptional({
    description: 'Fecha de eliminación',
    example: '2025-10-13T18:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
