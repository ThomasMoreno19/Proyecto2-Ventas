import { DetalleVentaEntity } from './detalle-venta.entity';
export class VentaEntity {
  id!: string;
  fecha!: Date;
  usuarioId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // relación 1..*
  detalleVenta?: DetalleVentaEntity[];

  // derivado/persistido
  total?: number;
}
