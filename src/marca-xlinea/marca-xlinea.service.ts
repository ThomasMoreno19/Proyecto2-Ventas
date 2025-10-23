import { Injectable } from '@nestjs/common';

@Injectable()
export class MarcaXlineaService {
  create() {
    return 'This action adds a new marcaXlinea';
  }

  findAll() {
    return `This action returns all marcaXlinea`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marcaXlinea`;
  }

  update(id: number) {
    return `This action updates a #${id} marcaXlinea`;
  }

  remove(id: number) {
    return `This action removes a #${id} marcaXlinea`;
  }
}
