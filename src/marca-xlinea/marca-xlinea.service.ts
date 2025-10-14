import { Injectable } from '@nestjs/common';
import { CreateMarcaXlineaDto } from './dto/create-marca-xlinea.dto';
import { UpdateMarcaXlineaDto } from './dto/update-marca-xlinea.dto';

@Injectable()
export class MarcaXlineaService {
  create(createMarcaXlineaDto: CreateMarcaXlineaDto) {
    return 'This action adds a new marcaXlinea';
  }

  findAll() {
    return `This action returns all marcaXlinea`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marcaXlinea`;
  }

  update(id: number, updateMarcaXlineaDto: UpdateMarcaXlineaDto) {
    return `This action updates a #${id} marcaXlinea`;
  }

  remove(id: number) {
    return `This action removes a #${id} marcaXlinea`;
  }
}
