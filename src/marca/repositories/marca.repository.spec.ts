import { Test, TestingModule } from '@nestjs/testing';
import { MarcaRepository } from './marca.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Marca } from '@prisma/client';
import { UpdateMarcaDto } from '../dto/update-marca.dto';

const mockDate = new Date();

const mockMarca: Marca = {
  id: 'marca-id-1',
  nombre: 'Nike',
  descripcion: 'Marca de ropa deportiva',
  createdAt: mockDate,
  updatedAt: mockDate,
  deletedAt: null,
};

const mockDeletedMarca: Marca = {
  id: 'marca-id-2',
  nombre: 'Adidas',
  descripcion: 'Marca eliminada',
  createdAt: mockDate,
  updatedAt: mockDate,
  deletedAt: new Date(),
};

const mockCreateDto = {
  nombre: 'NuevaMarca',
  descripcion: 'Descripción de prueba',
};

const mockUpdateDto: UpdateMarcaDto = {
  nombre: 'Nike Actualizada',
  descripcion: 'Nueva descripción',
  updatedAt: new Date(),
};

// 2. Mock del Servicio Prisma
const prismaServiceMock = {
  // Simulación de la colección 'marca' en Prisma
  marca: {
    create: jest.fn().mockResolvedValue(mockMarca),
    findMany: jest.fn().mockResolvedValue([mockMarca]),
    findFirst: jest.fn(),
    update: jest.fn().mockResolvedValue({ ...mockMarca, ...mockUpdateDto }),
  },
};

describe('MarcaRepository', () => {
  let repository: MarcaRepository;
  let prisma: typeof prismaServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarcaRepository,
        {
          provide: PrismaService,
          useValue: prismaServiceMock, // Proveemos el mock de Prisma
        },
      ],
    }).compile();

    repository = module.get<MarcaRepository>(MarcaRepository);
    prisma = module.get(PrismaService);

    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // --- CREATE METHOD TESTS ---
  describe('create', () => {
    it('should create a new Marca successfully', async () => {
      // Configuramos el mock para devolver la Marca recién creada
      prisma.marca.create.mockResolvedValue(mockMarca);

      const result = await repository.create(mockCreateDto);

      expect(prisma.marca.create).toHaveBeenCalledWith({
        data: {
          nombre: mockCreateDto.nombre,
          descripcion: mockCreateDto.descripcion,
          deletedAt: null,
        },
      });
      expect(result).toEqual(mockMarca);
    });

    it('should throw an error on duplicate Marca (Prisma P2002 code)', async () => {
      // Simular un error de duplicado P2002
      const duplicateError = { code: 'P2002' };
      prisma.marca.create.mockRejectedValue(duplicateError);

      await expect(repository.create(mockCreateDto)).rejects.toThrow(
        `Marca duplicada: ${mockCreateDto.nombre}`,
      );
    });

    it('should throw a generic error on other Prisma failures', async () => {
      // Simular cualquier otro error de Prisma
      const genericError = new Error('Database connection failed');
      prisma.marca.create.mockRejectedValue(genericError);

      await expect(repository.create(mockCreateDto)).rejects.toThrow(
        `Error al crear la marca: ${genericError.message}`,
      );
    });
  });

  // --- FIND ALL METHOD TESTS ---
  describe('findAll', () => {
    it('should return only non-deleted Marcas', async () => {
      // Configurar el mock para devolver una activa y una eliminada
      const allBrands = [mockMarca, mockDeletedMarca];
      prisma.marca.findMany.mockResolvedValue(allBrands);

      const result = await repository.findAll();

      // Debe retornar solo la marca activa
      expect(result).toEqual([mockMarca]);
      expect(prisma.marca.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no Marcas exist', async () => {
      prisma.marca.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  // --- FIND BY ID (NOMBRE) METHOD TESTS ---
  describe('findById', () => {
    it('should return the Marca if found and active', async () => {
      prisma.marca.findFirst.mockResolvedValue(mockMarca);

      const result = await repository.findById(mockMarca.nombre);

      expect(result).toEqual(mockMarca);
      expect(prisma.marca.findFirst).toHaveBeenCalledWith({
        where: { nombre: mockMarca.nombre },
      });
    });

    it('should return null if Marca is not found', async () => {
      prisma.marca.findFirst.mockResolvedValue(null);

      const result = await repository.findById('UnknownBrand');

      expect(result).toBeNull();
    });

    it('should return null if Marca is found but deleted', async () => {
      prisma.marca.findFirst.mockResolvedValue(mockDeletedMarca);

      const result = await repository.findById(mockDeletedMarca.nombre);

      expect(result).toBeNull();
    });
  });

  // --- UPDATE METHOD TESTS ---
  describe('update', () => {
    it('should update the Marca if found and active', async () => {
      // 1. Simular la búsqueda exitosa
      prisma.marca.findFirst.mockResolvedValue(mockMarca);
      // 2. Simular la actualización exitosa
      const updatedBrand = { ...mockMarca, ...mockUpdateDto };
      prisma.marca.update.mockResolvedValue(updatedBrand);

      const result = await repository.update(mockMarca.nombre, mockUpdateDto);

      expect(prisma.marca.findFirst).toHaveBeenCalledWith({
        where: { nombre: mockMarca.nombre },
      });
      expect(prisma.marca.update).toHaveBeenCalledWith({
        where: { id: mockMarca.id },
        data: mockUpdateDto,
      });
      expect(result).toEqual(updatedBrand);
    });

    it('should throw NotFoundException if Marca is not found', async () => {
      prisma.marca.findFirst.mockResolvedValue(null);

      await expect(repository.update('NonExistent', mockUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if Marca is deleted', async () => {
      prisma.marca.findFirst.mockResolvedValue(mockDeletedMarca);

      await expect(repository.update(mockDeletedMarca.nombre, mockUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // --- SOFT DELETE METHOD TESTS ---
  describe('softDelete', () => {
    it('should set deletedAt for an existing and active Marca', async () => {
      // 1. Simular la búsqueda exitosa
      prisma.marca.findFirst.mockResolvedValue(mockMarca);

      await repository.softDelete(mockMarca.nombre);

      expect(prisma.marca.findFirst).toHaveBeenCalledWith({
        where: { nombre: mockMarca.nombre },
      });
      // Verificamos que se llamó a update para establecer deletedAt
      expect(prisma.marca.update).toHaveBeenCalledWith({
        where: { id: mockMarca.id },
        data: { deletedAt: expect.any(Date) }, // Esperamos un objeto Date
      });
    });

    it('should throw NotFoundException if Marca is not found', async () => {
      prisma.marca.findFirst.mockResolvedValue(null);

      await expect(repository.softDelete('NonExistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if Marca is already deleted', async () => {
      prisma.marca.findFirst.mockResolvedValue(mockDeletedMarca);

      await expect(repository.softDelete(mockDeletedMarca.nombre)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
