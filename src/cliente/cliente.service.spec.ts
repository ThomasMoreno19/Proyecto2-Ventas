import { Test, TestingModule } from '@nestjs/testing';
import { ClienteService } from './cliente.service';
import { ClienteRepository } from './repository/cliente.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { toClienteDto } from './mapper/cliente.mapper';
import {
  ensureUniqueForCreate,
  ensureUniqueForUpdate,
  ensureExistsAndActive,
} from './helper/cliente.helper';

// Mocks de los helpers (deben ser mockeados para que el test sea unitario)
jest.mock('./helper/cliente.helper');
jest.mock('./mapper/cliente.mapper');

// --- Datos de Mocks Reutilizables ---
const mockCuil = '20345678901';
const mockCliente: Cliente = {
  cuil: mockCuil,
  nombre: 'juan',
  apellido: 'perez',
  telefono: '3515555555',
  email: 'juan.perez@test.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockClienteDto: CreateClienteDto = {
  cuil: mockCuil,
  nombre: 'juan',
  apellido: 'perez',
  telefono: '3515555555',
  email: 'juan.perez@test.com',
};

const mockCreateDto: CreateClienteDto = {
  ...mockClienteDto,
  nombre: 'nuevo cliente',
};

const mockUpdateDto: UpdateClienteDto = {
  cuil: mockCuil,
  nombre: 'cliente actualizado',
  telefono: '3515551111',
};

// --- Mock del Repositorio (Inversión de Dependencias) ---
const mockClienteRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

// --- Mock del PrismaService (Inyección pero no usado directamente en la lógica) ---
const mockPrismaService = {};

describe('ClienteService', () => {
  let service: ClienteService;
  let repository: jest.Mocked<typeof mockClienteRepository>;

  // Cast de los helpers mockeados para tener tipado Jest
  const mockEnsureUniqueForCreate = ensureUniqueForCreate as jest.Mock;
  const mockEnsureUniqueForUpdate = ensureUniqueForUpdate as jest.Mock;
  const mockEnsureExistsAndActive = ensureExistsAndActive as jest.Mock;
  const mockToClienteDto = toClienteDto as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: ClienteRepository,
          useValue: mockClienteRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
    repository = module.get(ClienteRepository);

    // Limpieza de mocks
    jest.clearAllMocks();

    // Configuración base de los mappers para que funcionen consistentemente
    mockToClienteDto.mockReturnValue(mockClienteDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    // Caso de Partición Equivalente: Lista de clientes
    it('should return a list of ClienteDto and call toClienteDto for mapping', async () => {
      repository.findAll.mockResolvedValue([mockCliente, mockCliente]);

      // Ajustamos el mock para devolver el DTO mapeado
      mockToClienteDto.mockReturnValueOnce(mockClienteDto).mockReturnValueOnce(mockClienteDto);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(mockToClienteDto).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockClienteDto, mockClienteDto]);
    });

    // Caso de Partición Equivalente: Lista vacía
    it('should return an empty array if repository returns an empty array', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(mockToClienteDto).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    // Caso de Partición Equivalente: Cliente existente
    it('should return a ClienteDto if client exists', async () => {
      repository.findById.mockResolvedValue(mockCliente);

      const result = await service.findById(mockCuil);

      expect(repository.findById).toHaveBeenCalledWith(mockCuil);
      expect(mockToClienteDto).toHaveBeenCalledWith(mockCliente);
      expect(result).toEqual(mockClienteDto);
    });

    // Caso de Error: Cliente no existente
    it('should throw NotFoundException if client does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById(mockCuil)).rejects.toThrow(NotFoundException);
      await expect(service.findById(mockCuil)).rejects.toThrow(
        `cliente con cuil ${mockCuil} no encontrado`,
      );
      expect(repository.findById).toHaveBeenCalledWith(mockCuil);
      expect(mockToClienteDto).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    // Caso de Éxito: Creación
    it('should call unique validation, repository.create, and return ClienteDto', async () => {
      // 1. Configura el helper para que resuelva sin error (es único)
      mockEnsureUniqueForCreate.mockResolvedValue(undefined);
      // 2. Configura el repositorio para que devuelva el objeto Cliente creado
      repository.create.mockResolvedValue(mockCliente);

      const result = await service.create(mockCreateDto);

      // Verificaciones
      expect(mockEnsureUniqueForCreate).toHaveBeenCalledWith(mockPrismaService, mockCreateDto);
      expect(repository.create).toHaveBeenCalledWith(mockCreateDto);
      expect(mockToClienteDto).toHaveBeenCalledWith(mockCliente);
      expect(result).toEqual(mockClienteDto);
    });

    // Caso de Error: Violación de unicidad
    it('should propagate error if unique validation fails', async () => {
      const uniqueError = new BadRequestException('CUIL o Email ya existen');
      // Configura el helper para que lance un error de unicidad
      mockEnsureUniqueForCreate.mockRejectedValue(uniqueError);

      await expect(service.create(mockCreateDto)).rejects.toThrow(uniqueError);

      // Verificación: El repositorio NO debe ser llamado si la validación falla
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    // Caso de Éxito: Actualización
    it('should call unique validation, repository.update, and return ClienteDto', async () => {
      // 1. Configura el helper para que resuelva sin error (es único)
      mockEnsureUniqueForUpdate.mockResolvedValue(undefined);
      // 2. Configura el repositorio para que devuelva el objeto Cliente actualizado
      repository.update.mockResolvedValue(mockCliente);

      const result = await service.update(mockUpdateDto);

      // Verificaciones
      expect(mockEnsureUniqueForUpdate).toHaveBeenCalledWith(mockPrismaService, mockUpdateDto);
      expect(repository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUpdateDto,
        }),
      );
      expect(mockToClienteDto).toHaveBeenCalledWith(mockCliente);
      expect(result).toEqual(mockClienteDto);
    });

    // Caso de Error: Violación de unicidad o Cliente no encontrado (repositorio propaga)
    it('should propagate error if unique validation fails or repository throws', async () => {
      const updateError = new BadRequestException('Email ya en uso por otro cliente');
      mockEnsureUniqueForUpdate.mockRejectedValue(updateError);

      await expect(service.update(mockUpdateDto)).rejects.toThrow(updateError);

      // Verificación: El repositorio NO debe ser llamado
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    // Caso de Éxito: Eliminación suave
    it('should call existence validation and repository.softDelete', async () => {
      const deleteResult = { cuil: mockCuil, deleteAt: new Date() };

      // 1. Configura el helper para que resuelva sin error (existe y está activo)
      mockEnsureExistsAndActive.mockResolvedValue(mockCliente);
      // 2. Configura el repositorio para que devuelva el resultado de la eliminación
      repository.softDelete.mockResolvedValue(deleteResult);

      const result = await service.softDelete(mockCuil);

      // Verificaciones
      expect(mockEnsureExistsAndActive).toHaveBeenCalledWith(mockPrismaService, mockCuil);
      expect(repository.softDelete).toHaveBeenCalledWith(mockCuil);
      expect(result).toEqual(deleteResult);
    });

    // Caso de Error: Cliente no existe o ya está inactivo
    it('should propagate error if existence validation fails', async () => {
      const existenceError = new NotFoundException('El cliente ya fue eliminado');
      // Configura el helper para que lance un error
      mockEnsureExistsAndActive.mockRejectedValue(existenceError);

      await expect(service.softDelete(mockCuil)).rejects.toThrow(existenceError);

      // Verificación: El repositorio NO debe ser llamado
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});
