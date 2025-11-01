import { CreateLineaDto } from '../dto/create-linea.dto';
import { UpdateLineaDto } from '../dto/update-linea.dto';
import { Linea, Marca } from '@prisma/client';

export interface ILineaRepository {
  findAll(): Promise<Linea[]>;
  findById(nombre: string): Promise<Linea | null>;
  create(data: CreateLineaDto): Promise<Linea>;
  update(nombre: string, data: UpdateLineaDto): Promise<Linea>;
  softDelete(nombre: string): Promise<void>;
}
