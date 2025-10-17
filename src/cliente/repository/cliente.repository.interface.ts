import { Cliente, Prisma } from '@prisma/client';
import { CreateClienteDto } from '../dto/create-cliente.dto';

export interface IClienteRepository {
  create(data: CreateClienteDto): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findById(cuil: string): Promise<Cliente | null>;
  update(cuil: string, data: Prisma.ClienteUpdateInput): Promise<Cliente>;
  softDelete(cuil: string): Promise<void>;
}
