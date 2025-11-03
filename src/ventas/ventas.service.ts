import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateVentaDto } from './dto/update-venta.dto';
import type { IVentaRepository } from './repository/venta.interface.repository';
import { CreateVentaDto } from './dto/create-venta.dto';
import { toVentaDto } from './mappers/venta.mapper';
import { validateCliente } from './helpers/validate-cliente.helper';
import { validateUsuario } from './helpers/validate-usuario.helper';
import {
  validateProductosYStock,
} from './helpers/validate-producto.helper';
import { disminuirStock, aumentarStock } from './helpers/actualizar-stock.helper';
import { UserSession } from '@thallesp/nestjs-better-auth';

@Injectable()
export class VentasService {
  constructor(
    @Inject('IVentaRepository') private readonly ventasRepository: IVentaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateVentaDto, session: UserSession) {
    // Validaciones
    await validateCliente(this.prisma, dto.cuil);
    await validateUsuario(this.prisma, session.user.id);
    await validateProductosYStock(this.prisma, dto.detalleVenta);
    await disminuirStock(this.prisma, dto.detalleVenta);

    // Llama al repositorio con solo el DTO
    const venta = await this.ventasRepository.create(dto, session);

    return toVentaDto(venta);
  }

  findAll(
    session: UserSession,
    query?: { skip?: number; take?: number; usuarioId?: string; from?: Date; to?: Date },
  ) {
    if (session.user.role !== 'ADMIN') {
      return this.ventasRepository.findAll(query);
    } else {
      return this.ventasRepository.findByUser(session.user.id);
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

  softDelete(id: string) {
    // TODO: Validaciones
    aumentarStock(this.prisma, id);
    return this.ventasRepository.softDelete(id);
  }
}
