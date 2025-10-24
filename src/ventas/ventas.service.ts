import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import type { VentaRepository } from './repository/venta.interface.repository';

@Injectable()
export class VentasService {
  constructor(
    @Inject('VentaRepository')
    private readonly ventasRepository: VentaRepository,
  ) {}

  create(dto: CreateVentaDto) {
    return this.ventasRepository.create(dto);
  }

  findAll(query?: { skip?: number; take?: number; usuarioId?: string; from?: Date; to?: Date }) {
    return this.ventasRepository.findAll(query);
  }

  async findOne(id: string) {
    const venta = await this.ventasRepository.findOne(id);
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  update(id: string, dto: UpdateVentaDto) {
    return this.ventasRepository.update(id, dto);
  }

  remove(id: string) {
    return this.ventasRepository.remove(id);
  }
}
