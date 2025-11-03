import { Cliente } from '@prisma/client';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

export interface IClienteRepository {
  create(data: CreateClienteDto): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findById(cuil: string): Promise<Cliente | null>;
  update(data: UpdateClienteDto): Promise<Cliente>;
  softDelete(cuil: string): Promise<boolean>;
}
