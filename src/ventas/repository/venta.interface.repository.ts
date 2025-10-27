import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { Venta } from '@prisma/client';
import { VentaWithAllRelations } from './venta.repository';
import { UserSession } from '@thallesp/nestjs-better-auth';

export interface VentaRepository {
  create(data: CreateVentaDto, session: UserSession): Promise<VentaWithAllRelations>;
  findAll(
    params?: {
      skip?: number;
      take?: number;
      usuarioId?: string;
      from?: Date;
      to?: Date;
    },
    to?: Date,
    from?: Date,
  ): Promise<{ items: Venta[]; total: number }>;
  findOne(id: string): Promise<VentaWithAllRelations | null>;
  update(id: string, data: UpdateVentaDto, session: UserSession): Promise<VentaWithAllRelations>;
  remove(id: string): Promise<{ ok: true }>;
  findByUser(usuarioId: string, to?: Date, from?: Date): Promise<VentaWithAllRelations[]>;
}
