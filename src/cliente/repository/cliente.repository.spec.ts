import { Test, TestingModule } from '@nestjs/testing';
import { ClienteRepository } from './cliente.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cliente } from '@prisma/client';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { NotFoundException } from '@nestjs/common';
import { DeleteClienteDto } from '../dto/delete-cliente.dto'; // Importación necesaria

// --- Datos de Mocks Reutilizables ---
const mockDate = new Date();
const mockCuil = '20345678901';

// Asumo que la entidad Cliente tiene un 'id' aunque el CUIL sea el identificador lógico
const mockCliente: Cliente = {
  cuil: mockCuil,
  nombre: 'juan',
  apellido: 'perez',
  telefono: '3515555555',
  email: 'juan.perez@test.com',
  createdAt: mockDate,
  updatedAt: mockDate,
  deletedAt: null,
};

const mockCreateDto: CreateClienteDto = {
  cuil: mockCuil,
  nombre: 'juan',
  apellido: 'perez',
  telefono: '3515555555',
  email: 'juan.perez@test.com',
};

const mockUpdateDto: UpdateClienteDto = {
  cuil: mockCuil,
  nombre: 'juan actualizado',
  telefono: '3515551111',
};

// --- Mock de Prisma (MocK de Dependencia) ---
const prismaMock = {
  cliente: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

// Tipamos el objeto mock de Prisma
type MockPrismaService = typeof prismaMock;

describe('ClienteRepository', () => {
  let repository: ClienteRepository;
  let prisma: jest.Mocked<MockPrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<ClienteRepository>(ClienteRepository);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.cliente.create with correct data and return the new client', async () => {
      prisma.cliente.create.mockResolvedValue(mockCliente as any);

      const result = await repository.create(mockCreateDto); // Verificamos la llamada a Prisma

      expect(prisma.cliente.create).toHaveBeenCalledWith({
        data: {
          // Debe coincidir con los campos esperados por el repositorio
          cuil: mockCreateDto.cuil,
          nombre: mockCreateDto.nombre,
          apellido: mockCreateDto.apellido,
          telefono: mockCreateDto.telefono,
          email: mockCreateDto.email,
          deletedAt: null, // 'direccion' se omitirá si no está en el DTO o en la entidad del repositorio
        },
      });
      expect(result).toEqual(mockCliente);
    });
  });

  describe('findAll', () => {
    // Partición Equivalente: Devuelve solo activos
    it('should return a list of active clients, filtering out soft-deleted ones', async () => {
      const deletedCliente: Cliente = { ...mockCliente, deletedAt: new Date() };
      const activeClientes: Cliente[] = [mockCliente];

      prisma.cliente.findMany.mockResolvedValue([...activeClientes, deletedCliente] as any);

      const result = await repository.findAll();

      expect(prisma.cliente.findMany).toHaveBeenCalled(); // Aquí solo se esperan los clientes donde deletedAt es null
      expect(result).toEqual(activeClientes);
    }); // Partición Equivalente: Lista vacía

    it('should return an empty array if no active clients exist', async () => {
      prisma.cliente.findMany.mockResolvedValue([]);
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    // Partición Equivalente: Cliente activo existente
    it('should return the client if it exists and is not deleted', async () => {
      prisma.cliente.findFirst.mockResolvedValue(mockCliente as any);

      const result = await repository.findById(mockCuil);

      expect(result).toEqual(mockCliente);
    }); // Límite de Error: Cliente soft-deleted

    it('should return null if the client is soft deleted', async () => {
      const deletedCliente: Cliente = { ...mockCliente, deletedAt: mockDate };
      prisma.cliente.findFirst.mockResolvedValue(deletedCliente as any);

      const result = await repository.findById(mockCuil);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    // Partición Equivalente: Actualización exitosa
    it('should check existence and then call prisma.cliente.update', async () => {
      const updatedCliente: UpdateClienteDto = {
        ...mockCliente,
        nombre: mockUpdateDto.nombre,
        telefono: mockUpdateDto.telefono,
      };

      prisma.cliente.findFirst.mockResolvedValue(mockCliente as any);
      prisma.cliente.update.mockResolvedValue(updatedCliente as any);

      const result = await repository.update(mockUpdateDto); // Verificamos la llamada a 'update'. El repositorio omite 'cuil' de 'data'

      expect(prisma.cliente.update).toHaveBeenCalledWith({
        where: { cuil: mockUpdateDto.cuil },
        data: {
          nombre: mockUpdateDto.nombre,
          telefono: mockUpdateDto.telefono, // Los demás campos del DTO (como 'apellido', 'email') no están en mockUpdateDto,
          // por lo que no deben aparecer en 'data' si son opcionales.
        },
      });
      expect(result).toEqual(updatedCliente);
    }); // Límite de Error: Cliente no encontrado o inactivo

    it('should throw NotFoundException if the client is not found (or soft deleted)', async () => {
      // Caso 1: Cliente soft deleted
      const deletedCliente: Cliente = { ...mockCliente, deletedAt: mockDate };
      prisma.cliente.findFirst.mockResolvedValue(deletedCliente as any);
      await expect(repository.update(mockUpdateDto)).rejects.toThrow(NotFoundException);
      expect(prisma.cliente.update).not.toHaveBeenCalled();
    });
  }); // --- 6. SOFT DELETE ---

  describe('softDelete', () => {
    let dateSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mockeamos Date para que el test sea determinístico
      dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    });

    afterEach(() => {
      dateSpy.mockRestore();
    }); // Partición Equivalente: Eliminación exitosa

    it('should check existence and call prisma.cliente.update to set deletedAt, returning DeleteClienteDto', async () => {
      const expectedDeleteDto: DeleteClienteDto = { cuil: mockCuil, deleteAt: mockDate };

      prisma.cliente.findFirst.mockResolvedValue(mockCliente as any);
      prisma.cliente.update.mockResolvedValue({} as any);

      const result = await repository.softDelete(mockCuil); // Verificamos la llamada a 'update'

      expect(prisma.cliente.update).toHaveBeenCalledWith({
        where: { cuil: mockCuil },
        data: { deletedAt: mockDate },
      }); // Verificamos que el retorno coincide con el DeleteClienteDto
      expect(result).toEqual(expectedDeleteDto);
    }); // Límite de Error: Cliente ya eliminado

    it('should throw NotFoundException if client is already soft deleted', async () => {
      const deletedCliente: Cliente = { ...mockCliente, deletedAt: mockDate };
      prisma.cliente.findFirst.mockResolvedValue(deletedCliente as any);
      await expect(repository.softDelete(mockCuil)).rejects.toThrow(NotFoundException);
      expect(prisma.cliente.update).not.toHaveBeenCalled();
    });
  });
});
