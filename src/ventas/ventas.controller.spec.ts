// src/ventas/ventas.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

// Mock de VentasService
const mockVentasService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Mock de AuthGuard
const MockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('VentasController', () => {
  let controller: VentasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentasController],
      providers: [
        {
          provide: VentasService,
          useValue: mockVentasService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    controller = module.get<VentasController>(VentasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create service with correct data', async () => {
      const dto: CreateVentaDto = {
        fecha: new Date(),
        usuarioId: '1',
        cuil: '12345678',
        detalleVenta: [{ productoId: '1', cantidad: 1, precioUnitario: 100 }],
      };
      const mockResponse = {
        id: '1',
        fecha: new Date(),
        usuario: { id: '1' },
        cliente: { cuil: '12345678' },
        detalleVenta: [],
      };
      mockVentasService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(dto);
      expect(result).toEqual(mockResponse);
      expect(mockVentasService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call findAll service with query params', async () => {
      const query = { skip: 0, take: 10, usuarioId: '1', from: new Date(), to: new Date() };
      const mockResponse = { items: [], total: 0 };
      mockVentasService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(query);
      expect(result).toEqual(mockResponse);
      expect(mockVentasService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call findOne service with correct id', async () => {
      const id = '1';
      const mockResponse = {
        id: '1',
        fecha: new Date(),
        usuario: { id: '1' },
        cliente: { cuil: '12345678' },
        detalleVenta: [],
      };
      mockVentasService.findOne.mockResolvedValue(mockResponse);

      const result = await controller.findOne(id);
      expect(result).toEqual(mockResponse);
      expect(mockVentasService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call update service with correct id and data', async () => {
      const id = '1';
      const dto: UpdateVentaDto = {
        fecha: new Date(),
        usuarioId: '1',
        cuil: '12345678',
        detalleVenta: [{ productoId: '1', cantidad: 1, precioUnitario: 100 }],
      };
      const mockResponse = {
        id: '1',
        fecha: new Date(),
        usuario: { id: '1' },
        cliente: { cuil: '12345678' },
        detalleVenta: [],
      };
      mockVentasService.update.mockResolvedValue(mockResponse);

      const result = await controller.update(id, dto);
      expect(result).toEqual(mockResponse);
      expect(mockVentasService.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call remove service with correct id', async () => {
      const id = '1';
      const mockResponse = { ok: true };
      mockVentasService.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove(id);
      expect(result).toEqual(mockResponse);
      expect(mockVentasService.remove).toHaveBeenCalledWith(id);
    });
  });
});
