import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import type { VentaEntity } from '../entities/venta.entity'; // o '../entities'

export interface VentaRepository {
  create(data: CreateVentaDto): Promise<VentaEntity>;
  findAll(params?: {
    skip?: number;
    take?: number;
    usuarioId?: string;
    from?: Date;
    to?: Date;
  }): Promise<{ items: VentaEntity[]; total: number }>;
  findOne(id: string): Promise<VentaEntity | null>;
  update(id: string, data: UpdateVentaDto): Promise<VentaEntity>;
  remove(id: string): Promise<{ ok: true }>;
}
