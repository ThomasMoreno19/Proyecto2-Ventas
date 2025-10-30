import { Marca, Prisma } from '@prisma/client';
import { CreateMarcaDto } from '../dto/create-marca.dto';

export interface IMarcaRepository {
  create(data: CreateMarcaDto): Promise<Marca>;
  findAll(): Promise<Marca[]>;
  findById(nombre: string): Promise<Marca | null>;
  update(nombre: string, data: Prisma.MarcaUpdateInput): Promise<Marca>;
  softDelete(nombre: string): Promise<void>;
  findMarcaXLineas(marcaId: string): Promise<any[]>;
}
