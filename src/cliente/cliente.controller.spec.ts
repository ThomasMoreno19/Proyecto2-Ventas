/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

const MockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('ClienteController', () => {
  let controller: ClienteController;
  let service: ClienteService;

  const mockClienteService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: ClienteService,
          useValue: mockClienteService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    controller = module.get<ClienteController>(ClienteController);
    service = module.get<ClienteService>(ClienteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un cliente correctamente', async () => {
      const dto: CreateClienteDto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@test.com',
        telefono: '+5491122334455',
        cuil: '20345678901',
      };

      mockClienteService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto.email, dto.telefono, dto.cuil, dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.objectContaining(dto));
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los clientes', async () => {
      const mockClientes = [
        {
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'a@test.com',
          telefono: '1116128371',
          cuil: '20918238891',
        },
        {
          nombre: 'Ana',
          apellido: 'Gómez',
          email: 'b@test.com',
          telefono: '2228912736',
          cuil: '27',
        },
      ];
      mockClienteService.findAll.mockResolvedValue(mockClientes);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockClientes);
    });
  });

  describe('findOne', () => {
    it('debería retornar un cliente por su CUIL', async () => {
      const cuil = '20345678901';
      const mockCliente = { nombre: 'Pedro', email: 'p@test.com', telefono: '333', cuil };
      mockClienteService.findById.mockResolvedValue(mockCliente);

      const result = await controller.findOne(cuil);

      expect(service.findById).toHaveBeenCalledWith(cuil);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('update', () => {
    it('debería actualizar un cliente', async () => {
      const dto: UpdateClienteDto = {
        cuil: '20345678901',
        nombre: 'Carlos',
        apellido: 'Gómez',
        email: 'carlos@test.com',
        telefono: '+5491144455566',
      };

      const updated = { ...dto };
      mockClienteService.update.mockResolvedValue(updated);

      const result = await controller.update(dto.cuil!, dto);

      expect(service.update).toHaveBeenCalledWith(dto);
      expect(result).toEqual(updated);
    });
  });

  // --- DELETE ---
  describe('remove', () => {
    it('debería eliminar lógicamente un cliente', async () => {
      const cuil = '20345678901';
      const deleted = { success: true };
      mockClienteService.softDelete.mockResolvedValue(deleted);

      const result = await controller.remove(cuil);

      expect(service.softDelete).toHaveBeenCalledWith(cuil);
      expect(result).toEqual(deleted);
    });
  });
});
