import { NotFoundException } from '@nestjs/common';
import { LineaRepository } from './linea.repository';
import { CreateLineaDto } from '../dto/create-linea.dto';
import { UpdateLineaDto } from '../dto/update-linea.dto';

describe('LineaRepository', () => {
  let repo: LineaRepository;
  let prisma: any;

  const mockPrisma = () => ({
    linea: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  });

  beforeEach(() => {
    prisma = mockPrisma();
    repo = new LineaRepository(prisma);
  });

  describe('findAll', () => {
    it('devuelve solo líneas activas', async () => {
      const lineasMock = [
        {
          id: '1',
          nombre: 'A',
          deletedAt: null,
          descripcion: 'desc',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          nombre: 'B',
          deletedAt: new Date(),
          descripcion: 'desc',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prisma.linea.findMany.mockResolvedValue(lineasMock);

      const result = await repo.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].nombre).toBe('A');
    });
  });

  describe('findById', () => {
    it('devuelve la línea si existe y está activa', async () => {
      const linea = {
        id: '1',
        nombre: 'A',
        deletedAt: null,
        descripcion: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.linea.findFirst.mockResolvedValue(linea);

      const result = await repo.findById('A');
      expect(result).toEqual(linea);
    });

    it('devuelve null si no existe', async () => {
      prisma.linea.findFirst.mockResolvedValue(null);
      const result = await repo.findById('X');
      expect(result).toBeNull();
    });

    it('devuelve null si está eliminada', async () => {
      const linea = {
        id: '1',
        nombre: 'A',
        deletedAt: new Date(),
        descripcion: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.linea.findFirst.mockResolvedValue(linea);
      const result = await repo.findById('A');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('crea una línea', async () => {
      const dto: CreateLineaDto = { nombre: 'A', descripcion: 'desc' };
      const linea = {
        id: '1',
        ...dto,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.linea.create.mockResolvedValue(linea);

      const result = await repo.create(dto);
      expect(prisma.linea.create).toHaveBeenCalledWith({
        data: { nombre: 'A', descripcion: 'desc', deletedAt: null },
      });
      expect(result).toEqual(linea);
    });
  });

  describe('update', () => {
    it('actualiza una línea existente', async () => {
      const dto: UpdateLineaDto = { descripcion: 'nuevo' };
      const linea = {
        id: '1',
        nombre: 'A',
        deletedAt: null,
        descripcion: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedLinea = { ...linea, ...dto };
      prisma.linea.findFirst.mockResolvedValue(linea);
      prisma.linea.update.mockResolvedValue(updatedLinea);

      const result = await repo.update('A', dto);
      expect(prisma.linea.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
      });
      expect(result).toEqual(updatedLinea);
    });

    it('lanza NotFoundException si no existe', async () => {
      prisma.linea.findFirst.mockResolvedValue(null);
      await expect(repo.update('X', { descripcion: 'nuevo' })).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFoundException si está eliminada', async () => {
      const linea = {
        id: '1',
        nombre: 'A',
        deletedAt: new Date(),
        descripcion: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.linea.findFirst.mockResolvedValue(linea);
      await expect(repo.update('A', { descripcion: 'nuevo' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('marca deletedAt con la fecha actual', async () => {
      const linea = {
        id: '1',
        nombre: 'A',
        deletedAt: null,
        descripcion: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.linea.findUnique.mockResolvedValue(linea);
      prisma.linea.update.mockResolvedValue({ ...linea, deletedAt: new Date() });

      await repo.softDelete('1');
      expect(prisma.linea.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('lanza NotFoundException si no existe', async () => {
      prisma.linea.findUnique.mockResolvedValue(null);
      await expect(repo.softDelete('X')).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFoundException si ya está eliminada', async () => {
      const linea = {
        id: '1',
        nombre: 'A',
        deletedAt: new Date(),
        descripcion: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.linea.findUnique.mockResolvedValue(linea);
      await expect(repo.softDelete('1')).rejects.toThrow(NotFoundException);
    });
  });
});