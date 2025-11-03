import { Marca, Prisma } from '@prisma/client';
import { CreateMarcaDto } from '../dto/create-marca.dto';

export interface IMarcaRepository {
  create(data: CreateMarcaDto): Promise<Marca>;
  findAll(): Promise<Marca[]>;
  findByName(nombre: string): Promise<Marca | null>;
  findById(id: string): Promise<Marca | null>;
  findMarca(nombre: string): Promise<Marca | null>;
  update(id: string, data: Prisma.MarcaUpdateInput): Promise<Marca>;
  softDelete(id: string): Promise<boolean>;
  findMarcaXLineas(marcaId: string): Promise<any[]>;
}
