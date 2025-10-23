import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsString()
  producto!: string;

  @IsNumber()
  @IsPositive()
  cantidad!: number;

  @IsNumber()
  @IsPositive()
  precioUnitario!: number;

  @IsNumber()
  @IsPositive()
  subtotal!: number; // si quieres calcularlo, puedes volverlo opcional
}
