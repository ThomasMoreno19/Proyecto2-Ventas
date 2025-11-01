import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateVentaDto } from './dto/update-venta.dto';
import type { VentaRepository } from './repository/venta.interface.repository';
import { CreateVentaDto } from './dto/create-venta.dto';
import { toVentaDto } from './mappers/venta.mapper';
import { validateCliente } from './helpers/validate-cliente.helper';
import { validateUsuario } from './helpers/validate-usuario.helper';
import {
  validateProductosYStock,
  actualizarStockProductos,
} from './helpers/validate-producto.helper';
import { UserSession } from '@thallesp/nestjs-better-auth';

@Injectable()
export class VentasService {
  constructor(
    @Inject('VentaRepository') private readonly ventasRepository: VentaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateVentaDto, session: UserSession) {
    console.log('Creating venta with DTO:', dto);
    // Validaciones
    await validateCliente(this.prisma, dto.cuil);
    console.log('Cliente validado');
    await validateUsuario(this.prisma, session.user.id);
    console.log('Usuario validado');
    await validateProductosYStock(this.prisma, dto.detalleVenta);
    console.log('Productos y stock validados');
    await actualizarStockProductos(this.prisma, dto.detalleVenta);
    console.log('Stock de productos actualizado');

    // Llama al repositorio con solo el DTO
    const venta = await this.ventasRepository.create(dto, session);

    return toVentaDto(venta);
  }

  findAll(
    session: UserSession,
    to?: Date,
    from?: Date,
    query?: { skip?: number; take?: number; usuarioId?: string; from?: Date; to?: Date },
  ) {
    if (session.user.role !== 'ADMIN') {
      return this.ventasRepository.findAll(query, to, from);
    } else {
      return this.ventasRepository.findByUser(session.user.id, to, from);
    }
  }

  async findOne(id: string) {
    const venta = await this.ventasRepository.findOne(id);
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  async update(id: string, dto: UpdateVentaDto, session: UserSession) {
    if (dto.cuil) {
      await validateCliente(this.prisma, dto.cuil);
    }
    if (session.user.id) {
      await validateUsuario(this.prisma, session.user.id);
    }
    if (dto.detalleVenta) {
      await validateProductosYStock(this.prisma, dto.detalleVenta);
    }
    return this.ventasRepository.update(id, dto, session);
  }

  remove(id: string) {
    return this.ventasRepository.remove(id);
  }
}
