import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateVentaDto } from './dto/update-venta.dto';
import type { VentaRepository } from './repository/venta.interface.repository';
import { CreateVentaDto } from './dto/create-venta.dto';
import { toVentaDto } from './mappers/venta.mapper';
import { validateCliente } from './helpers/validate-cliente.helper';
import { validateUsuario } from './helpers/validate-usuario.helper';
import { validateProductosYStock } from './helpers/validate-productos.helper';

@Injectable()
export class VentasService {
  constructor(
    @Inject('VentaRepository') private readonly ventasRepository: VentaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateVentaDto) {
    // Validaciones
    await validateCliente(this.prisma, dto.cuil);
    await validateUsuario(this.prisma, dto.usuarioId);
    await validateProductosYStock(this.prisma, dto.detalleVenta);

    // Llama al repositorio con solo el DTO
    const venta = await this.ventasRepository.create(dto);

    return toVentaDto(venta);
  }

  findAll(query?: { skip?: number; take?: number; usuarioId?: string; from?: Date; to?: Date }) {
    return this.ventasRepository.findAll(query);
  }

  async findOne(id: string) {
    const venta = await this.ventasRepository.findOne(id);
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  async update(id: string, dto: UpdateVentaDto) {
    await validateCliente(this.prisma, dto.cuil);
    await validateUsuario(this.prisma, dto.usuarioId);
    await validateProductosYStock(this.prisma, dto.detalleVenta);
    return this.ventasRepository.update(id, dto);
  }

  remove(id: string) {
    return this.ventasRepository.remove(id);
  }
}
