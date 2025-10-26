// src/ventas/ventas.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VentasService } from './ventas.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { NotFoundException } from '@nestjs/common';

// Mock de VentaRepository
const mockVentaRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Mock de PrismaService
const mockPrismaService = {
  $transaction: jest.fn(),
  venta: {
    findUnique: jest.fn(),
  },
};

// Mock de funciones de validación
const mockValidateCliente = jest.fn();
const mockValidateUsuario = jest.fn();
const mockValidateProductosYStock = jest.fn();

jest.mock('./helpers/validate-cliente.helper', () => ({
  validateCliente: mockValidateCliente,
}));

jest.mock('./helpers/validate-usuario.helper', () => ({
  validateUsuario: mockValidateUsuario,
}));

jest.mock('./helpers/validate-productos.helper', () => ({
  validateProductosYStock: mockValidateProductosYStock,
}));

describe('VentasService', () => {
  let service: VentasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VentasService,
        {
          provide: 'VentaRepository',
          useValue: mockVentaRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VentasService>(VentasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a venta and return DTO', async () => {
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
        detalleVenta: [],
      };
      mockValidateCliente.mockResolvedValue(undefined);
      mockValidateUsuario.mockResolvedValue(undefined);
      mockValidateProductosYStock.mockResolvedValue(undefined);
      mockVentaRepository.create.mockResolvedValue(mockVenta);

      const result = await service.create(dto);
      expect(result).toEqual({
        id: '1',
        fecha: mockVenta.fecha,
        usuarioId: '1',
        cuil: '12345678',
        detalleVenta: [],
      }); // Ajusta según toVentaDto
      expect(mockValidateCliente).toHaveBeenCalledWith(mockPrismaService, '12345678');
      expect(mockValidateUsuario).toHaveBeenCalledWith(mockPrismaService, '1');
      expect(mockValidateProductosYStock).toHaveBeenCalledWith(mockPrismaService, dto.detalleVenta);
      expect(mockVentaRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call findAll repository with query', async () => {
      const query = { skip: 0, take: 10, usuarioId: '1', from: new Date(), to: new Date() };
      const mockResponse = { items: [], total: 0 };
      mockVentaRepository.findAll.mockResolvedValue(mockResponse);

      const result = await service.findAll(query);
      expect(result).toEqual(mockResponse);
      expect(mockVentaRepository.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return venta or throw NotFoundException', async () => {
      const id = '1';
      const mockVenta = {
        id: '1',
        fecha: new Date(),
        usuario: { id: '1' },
        cliente: { cuil: '12345678' },
        detalleVenta: [],
      };
      mockVentaRepository.findOne.mockResolvedValue(mockVenta);

      const result = await service.findOne(id);
      expect(result).toEqual(mockVenta);
      expect(mockVentaRepository.findOne).toHaveBeenCalledWith(id);

      mockVentaRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update venta with validations', async () => {
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
      mockValidateCliente.mockResolvedValue(undefined);
      mockValidateUsuario.mockResolvedValue(undefined);
      mockValidateProductosYStock.mockResolvedValue(undefined);
      mockVentaRepository.update.mockResolvedValue(mockVenta);

      const result = await service.update(id, dto);
      expect(result).toEqual(mockVenta);
      expect(mockValidateCliente).toHaveBeenCalledWith(mockPrismaService, '12345678');
      expect(mockValidateUsuario).toHaveBeenCalledWith(mockPrismaService, '1');
      expect(mockValidateProductosYStock).toHaveBeenCalledWith(mockPrismaService, dto.detalleVenta);
      expect(mockVentaRepository.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call remove repository with id', async () => {
      const id = '1';
      const mockResponse = { ok: true };
      mockVentaRepository.remove.mockResolvedValue(mockResponse);

      const result = await service.remove(id);
      expect(result).toEqual(mockResponse);
      expect(mockVentaRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
