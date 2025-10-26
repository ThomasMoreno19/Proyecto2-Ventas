/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { LineaController } from './linea.controller';
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { LineaDto } from './dto/linea.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

const MockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('LineaController', () => {
  let controller: LineaController;
  let service: LineaService;

  const mockLineaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineaController],
      providers: [
        {
          provide: LineaService,
          useValue: mockLineaService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    controller = module.get<LineaController>(LineaController);
    service = module.get<LineaService>(LineaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return a LineaDto', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Linea1',
        descripcion: 'Desc',
        marcaIds: [],
      };
      const result: LineaDto = {
        id: '1',
        nombre: 'Linea1',
        descripcion: 'Desc',
      };

      mockLineaService.create.mockResolvedValue(result);

      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of LineaDto', async () => {
      const result: LineaDto[] = [
        {
          id: '1',
          nombre: 'Linea1',
          descripcion: 'Desc',
        },
      ];
      mockLineaService.findAll.mockResolvedValue(result);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findById with nombre and return LineaDto', async () => {
      const result: LineaDto = {
        id: '1',
        nombre: 'Linea1',
        descripcion: 'Desc',
      };
      mockLineaService.findById.mockResolvedValue(result);

      await expect(controller.findOne('Linea1')).resolves.toEqual(result);
      expect(service.findById).toHaveBeenCalledWith('Linea1');
    });
  });

  describe('update', () => {
    it('should call service.update with nombre and dto and return LineaDto', async () => {
      const dto: UpdateLineaDto = {
        nombre: 'Linea1',
        descripcion: 'Nueva Desc',
        marcaIds: [],
      };
      const result: LineaDto = {
        id: '1',
        nombre: 'Linea1',
        descripcion: 'Nueva Desc',
      };

      mockLineaService.update.mockResolvedValue(result);

      await expect(controller.update('Linea1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith('Linea1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.softDelete with nombre', async () => {
      mockLineaService.softDelete.mockResolvedValue(undefined);

      await expect(controller.remove('Linea1')).resolves.toBeUndefined();
      expect(service.softDelete).toHaveBeenCalledWith('Linea1');
    });
  });
});
