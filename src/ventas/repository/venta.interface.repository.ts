import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { Venta } from '@prisma/client';
import { VentaWithAllRelations } from './venta.repository';

export interface VentaRepository {
  create(data: CreateVentaDto): Promise<VentaWithAllRelations>;
  findAll(params?: {
    skip?: number;
    take?: number;
    usuarioId?: string;
    from?: Date;
    to?: Date;
  }): Promise<{ items: Venta[]; total: number }>;
  findOne(id: string): Promise<VentaWithAllRelations | null>;
  update(id: string, data: UpdateVentaDto): Promise<VentaWithAllRelations>;
  remove(id: string): Promise<{ ok: true }>;
}
