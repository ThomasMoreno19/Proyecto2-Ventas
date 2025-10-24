import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @IsDate()
  @ApiProperty({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Fecha de actualización del cliente',
  })
  updateAt!: Date;
}
