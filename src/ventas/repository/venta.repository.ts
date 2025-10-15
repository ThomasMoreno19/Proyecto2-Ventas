import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '../../../generated/prisma';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import type { VentaRepository } from './venta.interface.repository';
import type { VentaEntity } from '../entities/venta.entity';

type VentaWithDetalle = Prisma.VentaGetPayload<{
  include: { detalleVenta: true };
}>;

@Injectable()
export class PrismaVentaRepository implements VentaRepository {
  private readonly prisma = new PrismaClient();

  async create(data: CreateVentaDto): Promise<VentaEntity> {
    // Creamos y guardamos el id dentro de la transacción
    const ventaId = await this.prisma.$transaction(async (tx) => {
      const v = await tx.venta.create({
        data: {
          fecha: data.fecha,
          usuarioId: data.usuarioId,
        },
      });

      if (data.detalleVenta?.length) {
        await tx.detalleVenta.createMany({
          data: data.detalleVenta.map((d) => ({
            ventaId: v.id,
            producto: d.producto,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.subtotal,
          })),
        });
      }

      return v.id;
    });

    const created = await this.prisma.venta.findUnique({
      where: { id: ventaId },
      include: { detalleVenta: true },
    });

    if (!created) throw new NotFoundException('Venta no encontrada');
    return toVentaEntity(created);
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    usuarioId?: string;
    from?: Date;
    to?: Date;
  }): Promise<{ items: VentaEntity[]; total: number }> {
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
        include: { detalleVenta: true },
      }),
      this.prisma.venta.count({ where }),
    ]);

    const items = rows.map((v) => toVentaEntity(v));
    return { items, total: count };
  }

  async findOne(id: string): Promise<VentaEntity | null> {
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      include: { detalleVenta: true },
    });
    return venta ? toVentaEntity(venta) : null;
  }

  async update(id: string, data: UpdateVentaDto): Promise<VentaEntity> {
    const exists = await this.prisma.venta.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Venta no encontrada');

    await this.prisma.$transaction(async (tx) => {
      await tx.venta.update({
        where: { id },
        data: {
          fecha: data.fecha ?? undefined,
          usuarioId: data.usuarioId ?? undefined,
        },
      });

      if (data.detalleVenta) {
        await tx.detalleVenta.deleteMany({ where: { ventaId: id } });
        if (data.detalleVenta.length) {
          await tx.detalleVenta.createMany({
            data: data.detalleVenta.map((d) => ({
              ventaId: id,
              producto: d.producto,
              cantidad: d.cantidad,
              precioUnitario: d.precioUnitario,
              subtotal: d.subtotal,
            })),
          });
        }
      }
    });

    const updated = await this.prisma.venta.findUnique({
      where: { id },
      include: { detalleVenta: true },
    });

    if (!updated) throw new NotFoundException('Venta no encontrada');
    return toVentaEntity(updated);
  }

  async remove(id: string): Promise<{ ok: true }> {
    const exists = await this.prisma.venta.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Venta no encontrada');

    await this.prisma.$transaction([
      this.prisma.detalleVenta.deleteMany({ where: { ventaId: id } }),
      this.prisma.venta.delete({ where: { id } }),
    ]);

    return { ok: true };
  }
}

type DetalleEntity = NonNullable<VentaEntity['detalleVenta']>[number];

function toVentaEntity(v: VentaWithDetalle): VentaEntity {
  const detalles: VentaWithDetalle['detalleVenta'] = v.detalleVenta ?? [];
  const total = detalles.reduce((a, d) => a + Number(d.subtotal), 0);

  return {
    id: v.id,
    usuarioId: v.usuarioId,
    fecha: new Date(v.fecha),
    total,
    createdAt: new Date(v.createdAt),
    updatedAt: new Date(v.updatedAt),
    detalleVenta: detalles.map(
      (d): DetalleEntity => ({
        id: d.id,
        ventaId: d.ventaId,
        producto: d.producto,
        cantidad: Number(d.cantidad),
        precioUnitario: Number(d.precioUnitario),
        subtotal: Number(d.subtotal),
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
      }),
    ),
  };
}
