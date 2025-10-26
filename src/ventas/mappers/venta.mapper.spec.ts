// src/ventas/ventas.mapper.spec.ts
import { toVentaDto, toCreateCDetalleVentaDto } from './venta.mapper';
import { Venta, DetalleVenta, Product, Cliente, User } from '@prisma/client';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { CreateDetalleVentaDto } from '../dto/create-detalle-venta.dto';

describe('VentasMapper', () => {
  let mockVenta: Venta & {
    cliente: Cliente;
    usuario: User;
    detalleVenta: (DetalleVenta & { producto: Product })[];
  };
  let mockDetalle: DetalleVenta & { producto: Product };

  beforeEach(() => {
    mockDetalle = {
      id: '1',
      ventaId: '1',
      productoId: '1',
      cantidad: 2,
      precioUnitario: 100,
      producto: { id: '1', nombre: 'Producto 1', stock: 10, precio: 100, deletedAt: null },
    } as DetalleVenta & { producto: Product };

    mockVenta = {
      id: '1',
      fecha: new Date(),
      cuil: '12345678',
      usuarioId: '1',
      cliente: {
        cuil: '12345678',
        nombre: 'Cliente 1',
        apellido: 'Test',
        telefono: '123456789',
        email: 'cliente@example.com',
        deletedAt: null,
      } as Cliente,
      usuario: {
        id: '1',
        email: 'user@example.com',
        name: 'User 1',
        emailVerified: true,
        role: 'USER',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        sessions: [],
        accounts: [],
        ventas: [],
      } as User,
      detalleVenta: [mockDetalle],
    } as Venta & {
      cliente: Cliente;
      usuario: User;
      detalleVenta: (DetalleVenta & { producto: Product })[];
    };
  });

  it('should be defined', () => {
    expect(toVentaDto).toBeDefined();
    expect(toCreateCDetalleVentaDto).toBeDefined();
  });

  describe('toVentaDto', () => {
    it('should map venta to CreateVentaDto correctly', () => {
      const result: CreateVentaDto = toVentaDto(mockVenta);

      expect(result).toEqual({
        fecha: mockVenta.fecha,
        cuil: mockVenta.cuil,
        usuarioId: mockVenta.usuarioId,
        detalleVenta: [
          {
            productoId: mockDetalle.productoId,
            cantidad: mockDetalle.cantidad,
            precioUnitario: mockDetalle.precioUnitario,
          },
        ],
      });
    });

    it('should handle empty detalleVenta', () => {
      const ventaWithoutDetails = { ...mockVenta, detalleVenta: [] };
      const result: CreateVentaDto = toVentaDto(ventaWithoutDetails);

      expect(result).toEqual({
        fecha: mockVenta.fecha,
        cuil: mockVenta.cuil,
        usuarioId: mockVenta.usuarioId,
        detalleVenta: [],
      });
    });
  });

  describe('toCreateCDetalleVentaDto', () => {
    it('should map detalleVenta to CreateDetalleVentaDto correctly', () => {
      const result: CreateDetalleVentaDto = toCreateCDetalleVentaDto(mockDetalle);

      expect(result).toEqual({
        productoId: mockDetalle.productoId,
        cantidad: mockDetalle.cantidad,
        precioUnitario: mockDetalle.precioUnitario,
      });
    });
  });
});
