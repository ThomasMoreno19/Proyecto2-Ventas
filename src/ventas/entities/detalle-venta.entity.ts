export class DetalleVentaEntity {
  id!: string;
  ventaId!: string;
  producto!: string;
  cantidad!: number;
  precioUnitario!: number;
  subtotal!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
