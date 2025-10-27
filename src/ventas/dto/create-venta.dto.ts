import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { CreateDetalleVentaDto } from './create-detalle-venta.dto';

export class CreateVentaDto {
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: '2025-10-25T14:30:00.000Z',
    description: 'Fecha de la venta en formato ISO',
  })
  fecha?: Date;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'El usuarioId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
  })
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID del usuario que realiza la venta (ObjectId de MongoDB)',
  })
  usuarioId!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^\d{11}$/, {
    message: 'El cuil debe ser un número de 11 dígitos',
  })
  @ApiProperty({
    example: '20123456789',
    description: 'CUIL del cliente asociado a la venta',
  })
  cuil!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  @ApiProperty({
    type: [CreateDetalleVentaDto],
    description: 'Arreglo de detalles de la venta',
    example: [
      {
        productoId: '507f1f77bcf86cd799439012',
        cantidad: 2,
        precioUnitario: 100.5,
      },
    ],
  })
  detalleVenta!: CreateDetalleVentaDto[];
}
