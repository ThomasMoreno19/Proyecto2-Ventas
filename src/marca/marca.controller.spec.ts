/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MarcaController } from './marca.controller';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaDto } from './dto/marca.dto';

describe('MarcaController', () => {
  let controller: MarcaController;
  let service: MarcaService;

  const mockMarcaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcaController],
      providers: [
        {
          provide: MarcaService,
          useValue: mockMarcaService,
        },
      ],
    }).compile();

    controller = module.get<MarcaController>(MarcaController);
    service = module.get<MarcaService>(MarcaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return a MarcaDto', async () => {
      const dto: CreateMarcaDto = { nombre: 'Marca1', descripcion: 'Desc' };
      const result: MarcaDto = {
        id: '1',
        nombre: 'Marca1',
        descripcion: 'Desc',
      };

      mockMarcaService.create.mockResolvedValue(result);

      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of MarcaDto', async () => {
      const result: MarcaDto[] = [
        {
          id: '1',
          nombre: 'Marca1',
          descripcion: 'Desc',
        },
      ];
      mockMarcaService.findAll.mockResolvedValue(result);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findById with nombre and return MarcaDto', async () => {
      const result: MarcaDto = {
        id: '1',
        nombre: 'Marca1',
        descripcion: 'Desc',
      };
      mockMarcaService.findById.mockResolvedValue(result);

      await expect(controller.findOne('Marca1')).resolves.toEqual(result);
      expect(service.findById).toHaveBeenCalledWith('Marca1');
    });
  });

  describe('update', () => {
    it('should call service.update with nombre and dto and return MarcaDto', async () => {
      const dto: UpdateMarcaDto = {
        nombre: 'Marca1',
        descripcion: 'Nueva Desc',
      };
      const result: MarcaDto = {
        id: '1',
        nombre: 'Marca1',
        descripcion: 'Nueva Desc',
      };

      mockMarcaService.update.mockResolvedValue(result);

      await expect(controller.update('Marca1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith('Marca1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.softDelete with nombre', async () => {
      mockMarcaService.softDelete.mockResolvedValue(undefined);

      await expect(controller.remove('Marca1')).resolves.toBeUndefined();
      expect(service.softDelete).toHaveBeenCalledWith('Marca1');
    });
  });
});
