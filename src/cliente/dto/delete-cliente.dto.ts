import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsString, MinLength, IsDate } from 'class-validator';

export class DeleteClienteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(12)
  @ApiProperty({ example: '20123456789', description: 'CUIL del cliente' })
  cuil!: string;

  @IsDate()
  @ApiProperty({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Fecha de eliminación del cliente',
  })
  deleteAt!: Date;
}
