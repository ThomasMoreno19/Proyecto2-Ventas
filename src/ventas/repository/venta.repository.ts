import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import type { VentaRepository } from './venta.interface.repository';
import { Venta } from '@prisma/client';

type VentaWithDetalle = Prisma.VentaGetPayload<{
  include: { detalleVenta: true };
}>;

@Injectable()
export class PrismaVentaRepository implements VentaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVentaDto): Promise<VentaWithDetalle> {
    // Mapeamos los detalles del DTO a la estructura de CreateInput de Prisma
    // Asumiendo que el Service ya inyectó el precioUnitario en el DTO (usando 'any' temporalmente)
    // y que el producto ya existe.
    const detalleCreateInput: Prisma.DetalleVentaCreateWithoutVentaInput[] = data.detalleVenta.map(
      (d: any) => ({
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        producto: {
          connect: {
            id: d.productoId,
          },
        },
      }),
    );

    // Ejecución de la escritura anidada dentro de la transacción.
    const createdVenta = await this.prisma.$transaction(async (tx) => {
      return tx.venta.create({
        data: {
          fecha: data.fecha,
          usuarioId: data.usuarioId,
          cuil: data.cuil, 
          detalleVenta: {
            create: detalleCreateInput,
          },
        },
        include: {
          detalleVenta: true,
        },
      });
    });

    return createdVenta as VentaWithDetalle;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    usuarioId?: string;
    from?: Date;
    to?: Date;
}): Promise<{ items: VentaWithDetalles[]; total: number }> {
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

    // 🚨 CORRECCIÓN: Eliminamos la llamada a toVentaEntity. 
    // Los 'rows' ya tienen el tipo VentaWithDetalles.
    return { items: rows as VentaWithDetalles[], total: count };
}

  async findOne(id: string): Promise<Venta | null> {
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      include: { detalleVenta: true },
    });
    return venta ? toVentaEntity(venta) : null;
  }

  async update(id: string, data: UpdateVentaDto): Promise<Venta> {
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

type DetalleEntity = NonNullable<Venta['detalleVenta']>[number];

function toVentaEntity(v: VentaWithDetalle): Venta {
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
