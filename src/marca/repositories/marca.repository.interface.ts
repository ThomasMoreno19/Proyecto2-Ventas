import { Marca, Prisma } from '@prisma/client';

export interface IMarcaRepository {
  create(data: Prisma.MarcaCreateInput): Promise<Marca>;
  findAll(): Promise<Marca[]>;
  findById(id: number): Promise<Marca | null>;
  update(id: number, data: Prisma.MarcaUpdateInput): Promise<Marca>;
  softDelete(id: number): Promise<Marca>;
}
