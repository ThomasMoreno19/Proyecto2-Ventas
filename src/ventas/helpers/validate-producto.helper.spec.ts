// src/ventas/helpers/validate-producto.helper.spec.ts
import { validateProductosYStock, actualizarStockProductos } from './validate-producto.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from '@prisma/client';

describe('validateProductoHelper', () => {
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      product: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as PrismaService;
  });

  it('should be defined', () => {
    expect(validateProductosYStock).toBeDefined();
    expect(actualizarStockProductos).toBeDefined();
  });

  describe('validateProductosYStock', () => {
    it('should pass validation with valid products and stock', async () => {
      const detalles = [{ productoId: '1', cantidad: 2 }];
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        nombre: 'Producto 1',
        stock: 10,
        precio: 100,
        deletedAt: null,
      } as Product);

      await expect(validateProductosYStock(prisma, detalles)).resolves.toBeUndefined();
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if product not found', async () => {
      const detalles = [{ productoId: '1', cantidad: 2 }];
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(validateProductosYStock(prisma, detalles)).rejects.toThrow(NotFoundException);
      await expect(validateProductosYStock(prisma, detalles)).rejects.toThrow(
        'Producto con ID 1 no encontrado',
      );
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw BadRequestException if stock insufficient', async () => {
      const detalles = [{ productoId: '1', cantidad: 15 }];
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        nombre: 'Producto 1',
        stock: 10,
        precio: 100,
        deletedAt: null,
      } as Product);

      await expect(validateProductosYStock(prisma, detalles)).rejects.toThrow(BadRequestException);
      await expect(validateProductosYStock(prisma, detalles)).rejects.toThrow(
        'Stock insuficiente para el producto Producto 1. Stock disponible: 10, solicitado: 15',
      );
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('actualizarStockProductos', () => {
    it('should update stock for each product', async () => {
      const detalles = [
        { productoId: '1', cantidad: 2 },
        { productoId: '2', cantidad: 1 },
      ];
      (prisma.product.update as jest.Mock).mockResolvedValue({
        id: '1',
        stock: 8,
        updatedAt: new Date(),
      } as Product);

      await actualizarStockProductos(prisma, detalles);
      expect(prisma.product.update).toHaveBeenCalledTimes(2);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { stock: { decrement: 2 }, updatedAt: expect.any(Date) },
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '2' },
        data: { stock: { decrement: 1 }, updatedAt: expect.any(Date) },
      });
    });
  });
});