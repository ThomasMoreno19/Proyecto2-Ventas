// src/ventas/ventas.repository.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaVentaRepository } from './venta.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { NotFoundException } from '@nestjs/common';

// Mock de PrismaService
const mockPrismaService = {
  $transaction: jest.fn(),
  venta: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    // Se ha eliminado detalleVenta de aquí
  },
  detalleVenta: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
};

describe('PrismaVentaRepository', () => {
  let repository: PrismaVentaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaVentaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaVentaRepository>(PrismaVentaRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a venta with relations', async () => {
      const dto: CreateVentaDto = {
        fecha: new Date(),
        usuarioId: '1',
        cuil: '12345678',
        detalleVenta: [{ productoId: '1', cantidad: 1, precioUnitario: 100 }],
      };
      const mockVenta = {
        id: '1',
        fecha: new Date(),
        usuario: { id: '1' },
        cliente: { cuil: '12345678' },
        detalleVenta: [{ id: '1', producto: { id: '1' } }],
      };
      mockPrismaService.$transaction.mockImplementation(
        async (callback: (...args: any[]) => any) => {
          return await callback(mockPrismaService);
        },
      );
      mockPrismaService.venta.create.mockResolvedValue(mockVenta);

      const result = await repository.create(dto);
      expect(result).toEqual(mockVenta);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.venta.create).toHaveBeenCalledWith({
        data: {
          fecha: dto.fecha,
          usuario: { connect: { id: dto.usuarioId } },
          cliente: { connect: { cuil: dto.cuil } },
          detalleVenta: {
            create: [{ cantidad: 1, precioUnitario: 100, producto: { connect: { id: '1' } } }],
          },
        },
        include: {
          cliente: true,
          usuario: true,
          detalleVenta: { include: { producto: true } },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return ventas with pagination and filters', async () => {
      const params = { skip: 0, take: 10, usuarioId: '1', from: new Date(), to: new Date() };
      const mockRows = [{ id: '1' }];
      const mockCount = 1;
      // El mock de findAll solo necesita mockResolvedValue, ya que no usa el callback.
      mockPrismaService.$transaction.mockResolvedValue([mockRows, mockCount]);

      const result = await repository.findAll(params);
      expect(result).toEqual({ items: mockRows, total: mockCount });

      // La verificación ahora será correcta porque el mock es fresco:
      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        expect.any(Function),
        expect.any(Function),
      ]);
      expect(mockPrismaService.venta.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { usuarioId: '1', fecha: { gte: params.from, lte: params.to } },
        orderBy: { fecha: 'desc' },
        include: {
          cliente: true,
          usuario: true,
          detalleVenta: { include: { producto: true } },
        },
      });
      expect(mockPrismaService.venta.count).toHaveBeenCalledWith({
        where: { usuarioId: '1', fecha: { gte: params.from, lte: params.to } },
      });
    });
  });

  describe('findOne', () => {
    it('should return venta or null', async () => {
      const id = '1';
      const mockVenta = {
        id: '1',
        fecha: new Date(),
        usuario: { id: '1' },
        cliente: { cuil: '12345678' },
        detalleVenta: [],
      };
      mockPrismaService.venta.findUnique.mockResolvedValue(mockVenta);

      const result = await repository.findOne(id);
      expect(result).toEqual(mockVenta);
      expect(mockPrismaService.venta.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          cliente: true,
          usuario: true,
          detalleVenta: { include: { producto: true } },
        },
      });

      mockPrismaService.venta.findUnique.mockResolvedValue(null);
      const resultNull = await repository.findOne('nonexistent');
      expect(resultNull).toBeNull();
    });
  });

  describe('update', () => {
    it('should update venta with relations', async () => {
      const id = '1';
      const dto: UpdateVentaDto = {
        fecha: new Date(),
        usuarioId: '1',
        cuil: '12345678',
        detalleVenta: [{ productoId: '1', cantidad: 1, precioUnitario: 100 }],
      };
      const mockVenta = {
        id: '1',
        fecha: new Date(),
        usuario: { id: '1' },
        cliente: { cuil: '12345678' },
        detalleVenta: [],
      };
      mockPrismaService.venta.findUnique.mockResolvedValue(mockVenta);
      mockPrismaService.$transaction.mockImplementation(
        async (callback: (...args: any[]) => any) => {
          return await callback(mockPrismaService);
        },
      );
      mockPrismaService.venta.update.mockResolvedValue(mockVenta);
      mockPrismaService.detalleVenta.deleteMany.mockResolvedValue(undefined);
      mockPrismaService.detalleVenta.createMany.mockResolvedValue(undefined);

      const result = await repository.update(id, dto);
      expect(result).toEqual(mockVenta);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.venta.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          fecha: dto.fecha,
          usuario: { connect: { id: dto.usuarioId } },
          cliente: { connect: { cuil: dto.cuil } },
        },
      });
      expect(mockPrismaService.detalleVenta.deleteMany).toHaveBeenCalledWith({
        where: { ventaId: id },
      });
      expect(mockPrismaService.detalleVenta.createMany).toHaveBeenCalledWith({
        data: [{ ventaId: id, productoId: '1', cantidad: 1, precioUnitario: 100 }],
      });
    });

    it('should throw NotFoundException if venta not found', async () => {
      const id = 'nonexistent';
      mockPrismaService.venta.findUnique.mockResolvedValue(null);

      await expect(repository.update(id, {} as UpdateVentaDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove venta and details', async () => {
      const id = '1';
      const mockVenta = { id: '1' };
      mockPrismaService.venta.findUnique.mockResolvedValue(mockVenta);
      mockPrismaService.$transaction.mockResolvedValue(undefined);

      const result = await repository.remove(id);
      expect(result).toEqual({ ok: true });
      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        expect.any(Function),
        expect.any(Function),
      ]);
      expect(mockPrismaService.detalleVenta.deleteMany).toHaveBeenCalledWith({
        where: { ventaId: id },
      });
      expect(mockPrismaService.venta.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw NotFoundException if venta not found', async () => {
      const id = 'nonexistent';
      mockPrismaService.venta.findUnique.mockResolvedValue(null);

      await expect(repository.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
