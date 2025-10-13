import { CreateLineaDto } from '../dto/create-linea.dto';
import { UpdateLineaDto } from '../dto/update-linea.dto';
import { Linea } from '@prisma/client';

export interface ILineaRepository {
  findAll(): Promise<Linea[]>;
  findById(id: number): Promise<Linea | null>;
  create(data: CreateLineaDto): Promise<Linea>;
  update(id: number, data: UpdateLineaDto): Promise<Linea>;
  softDelete(id: number): Promise<void>;
}
