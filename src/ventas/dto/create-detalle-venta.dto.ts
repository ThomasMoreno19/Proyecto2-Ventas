import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Matches, IsNotEmpty } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'El productoId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
  })
  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID del producto asociado al detalle de la venta (ObjectId de MongoDB)',
  })
  productoId!: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    example: 2,
    description: 'Cantidad de unidades del producto en la venta',
  })
  cantidad!: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    example: 100.5,
    description: 'Precio unitario del producto en la venta',
  })
  precioUnitario!: number;
}