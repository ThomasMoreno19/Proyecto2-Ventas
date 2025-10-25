import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { Venta } from '@prisma/client';

export interface VentaRepository {
  create(data: CreateVentaDto): Promise<Venta>;
  findAll(params?: {
    skip?: number;
    take?: number;
    usuarioId?: string;
    from?: Date;
    to?: Date;
  }): Promise<{ items: Venta[]; total: number }>;
  findOne(id: string): Promise<Venta | null>;
  update(id: string, data: UpdateVentaDto): Promise<Venta>;
  remove(id: string): Promise<{ ok: true }>;
}
