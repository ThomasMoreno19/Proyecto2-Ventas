import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-marca.dto';

export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {
  @ApiPropertyOptional({
    description: 'Fecha de última actualización',
    example: '2025-10-13T18:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty({ message: 'es obligatorio.' })
  updatedAt?: Date;
}
