import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import type { VentaRepository } from './venta.interface.repository';

export type VentaWithAllRelations = Prisma.VentaGetPayload<{
  include: {
    cliente: true;
    usuario: true;
    detalleVenta: {
      include: {
        producto: true;
      };
    };
  };
}>;

@Injectable()
export class PrismaVentaRepository implements VentaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVentaDto): Promise<VentaWithAllRelations> {
    const detalleCreateInput: Prisma.DetalleVentaCreateWithoutVentaInput[] = data.detalleVenta.map(
      (d) => ({
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        producto: {
          connect: { id: d.productoId },
        },
      }),
    );

    // Usa VentaCreateInput (con relaciones)
    const ventaCreateInput: Prisma.VentaCreateInput = {
      fecha: data.fecha,
      usuario: { connect: { id: data.usuarioId } }, // relación
      cliente: { connect: { cuil: data.cuil } }, // relación
      detalleVenta: { create: detalleCreateInput },
    };

    // 🚨 CORRECCIÓN: Usar 'await' para resolver la transacción y confiar en la inferencia
    const createdVenta = await this.prisma.$transaction(async (tx) => {
      return tx.venta.create({
        data: ventaCreateInput,
        // Incluir todas las relaciones requeridas por el tipo de retorno
        include: {
          cliente: true,
          usuario: true,
          detalleVenta: {
            include: { producto: true },
          },
        },
      });
    });

    // 🚨 Eliminamos el 'as VentaWithAllRelations' al final del bloque $transaction.
    // El objeto 'createdVenta' ya tiene el tipo correcto por inferencia del 'include'.
    return createdVenta;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    usuarioId?: string;
    from?: Date;
    to?: Date;
  }): Promise<{ items: VentaWithAllRelations[]; total: number }> {
    // 🚨 Tipo de retorno actualizado
    const { skip = 0, take = 20, usuarioId, from, to } = params ?? {};

    const where: Prisma.VentaWhereInput = {};
    if (usuarioId) where.usuarioId = usuarioId;
    if (from || to) {
      where.fecha = {};
      if (from) where.fecha.gte = from;
      if (to) where.fecha.lte = to;
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.venta.findMany({
        skip,
        take,
        where,
        orderBy: { fecha: 'desc' },
        // 🚨 Incluir TODAS las relaciones
        include: {
          cliente: true,
          usuario: true,
          detalleVenta: {
            include: { producto: true },
          },
        },
      }),
      this.prisma.venta.count({ where }),
    ]);

    // Devolvemos el array tipado con el tipo completo
    return { items: rows as VentaWithAllRelations[], total: count };
  }

  async findByUser(usuarioId: string, to?: Date, from?: Date): Promise<VentaWithAllRelations[]> {
    // 🚨 Tipo de retorno actualizado
    const ventas = await this.prisma.venta.findMany({
      where: { usuarioId, fecha: { gte: from, lte: to } },
      // 🚨 Incluir TODAS las relaciones
      include: {
        cliente: true,
        usuario: true,
        detalleVenta: {
          include: { producto: true },
        },
      },
    });
    return ventas as VentaWithAllRelations[];
  }

  async findOne(id: string): Promise<VentaWithAllRelations | null> {
    // 🚨 Tipo de retorno actualizado
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      // 🚨 Incluir TODAS las relaciones
      include: {
        cliente: true,
        usuario: true,
        detalleVenta: {
          include: { producto: true },
        },
      },
    });
    return venta as VentaWithAllRelations | null;
  }

  async update(id: string, data: UpdateVentaDto): Promise<VentaWithAllRelations> {
    // 🚨 Tipo de retorno actualizado
    const exists = await this.prisma.venta.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Venta no encontrada');

    await this.prisma.$transaction(async (tx) => {
      // 1. Actualizar campos de cabecera de Venta
      await tx.venta.update({
        where: { id },
        data: {
          fecha: data.fecha ?? undefined,
          // Usamos connect para las relaciones, pero actualizando el ID
          usuario: data.usuarioId ? { connect: { id: data.usuarioId } } : undefined,
          cliente: data.cuil ? { connect: { cuil: data.cuil } } : undefined,
        },
      });

      // 2. Reemplazar detalles de venta (si se proporcionan)
      if (data.detalleVenta) {
        // Estrategia: Borrar todos los detalles existentes y recrear los nuevos
        await tx.detalleVenta.deleteMany({ where: { ventaId: id } });

        if (data.detalleVenta.length) {
          await tx.detalleVenta.createMany({
            data: data.detalleVenta.map((d) => ({
              ventaId: id,
              productoId: d.productoId,
              cantidad: d.cantidad,
              precioUnitario: d.precioUnitario,
            })),
          });
        }
      }
    });

    // 3. Obtener el objeto actualizado con todas las relaciones
    const updated = await this.prisma.venta.findUnique({
      where: { id },
      // 🚨 Incluir TODAS las relaciones
      include: {
        cliente: true,
        usuario: true,
        detalleVenta: {
          include: { producto: true },
        },
      },
    });

    if (!updated) throw new NotFoundException('Venta no encontrada');
    return updated as VentaWithAllRelations;
  }

  async remove(id: string): Promise<{ ok: true }> {
    const exists = await this.prisma.venta.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Venta no encontrada');

    // Asumimos que onDelete: Cascade en el esquema maneja detalleVenta,
    // si no, la transacción explícita es correcta.
    await this.prisma.$transaction([
      this.prisma.detalleVenta.updateMany({
        where: { ventaId: id },
        data: { deletedAt: new Date() },
      }),
      this.prisma.venta.update({
        where: { id: id },
        data: { deletedAt: new Date() },
      }),
    ]);

    return { ok: true };
  }
}
