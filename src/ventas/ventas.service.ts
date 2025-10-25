import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateVentaDto } from './dto/update-venta.dto';
import type { VentaRepository } from './repository/venta.interface.repository';
import { VentaHelper } from './helpers/venta.helper';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @Inject('VentaRepository') private readonly ventasRepository: VentaRepository,
    private readonly prisma: PrismaService,
    private readonly ventaHelper: VentaHelper,
  ) {}

  async create(dto: CreateVentaDto) {
    // Validate client
    await this.ventaHelper.validateCliente(dto.cuil);

    // Validate user
    await this.ventaHelper.validateUsuario(dto.usuarioId);

    // Validate products and stock
    await this.ventaHelper.validateProductosYStock(dto.detalleVenta);

    // Delegate creation to the repository
    const venta = await this.ventasRepository.create(dto);

    return toDto(venta);
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
