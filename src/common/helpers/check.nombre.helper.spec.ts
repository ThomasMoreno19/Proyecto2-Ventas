import { BadRequestException } from '@nestjs/common';
import { checkUniqueName } from './check.nombre.helper';
import { PrismaService } from '../../prisma/prisma.service';

describe('checkUniqueName helper', () => {
  let prisma: PrismaService;

  // Mocks tipados para prisma.$transaction
  type TransactionFn<T> = (tx: {
    marca: {
      findFirst: jest.Mock<
        Promise<{ id: string; nombre: string } | null>,
        [{ where: { nombre: string } }]
      >;
    };
    linea: {
      findFirst: jest.Mock<
        Promise<{ id: string; nombre: string } | null>,
        [{ where: { nombre: string } }]
      >;
    };
  }) => Promise<T>;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn() as unknown as PrismaService['$transaction'],
    } as unknown as PrismaService;
  });

  it('debe resolver si no existe ninguna marca con ese nombre', async () => {
    const mockTx = {
      marca: { findFirst: jest.fn().mockResolvedValue(null) },
      linea: { findFirst: jest.fn().mockResolvedValue(null) },
    };

    (prisma.$transaction as jest.Mock).mockImplementation(
      (fn: TransactionFn<any>) => fn(mockTx),
    );

    await expect(
      checkUniqueName(prisma, 'marca', 'NuevaMarca'),
    ).resolves.toBeUndefined();
    expect(mockTx.marca.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'nuevamarca' },
    });
  });

  it('debe lanzar BadRequestException si ya existe la marca', async () => {
    const existing = { id: '1', nombre: 'marcaexistente' };
    const mockTx = {
      marca: { findFirst: jest.fn().mockResolvedValue(existing) },
      linea: { findFirst: jest.fn().mockResolvedValue(null) },
    };

    (prisma.$transaction as jest.Mock).mockImplementation(
      (fn: TransactionFn<any>) => fn(mockTx),
    );

    await expect(
      checkUniqueName(prisma, 'marca', 'MarcaExistente'),
    ).rejects.toThrow(BadRequestException);
    expect(mockTx.marca.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'marcaexistente' },
    });
  });

  it('debe resolver si no existe ninguna línea con ese nombre', async () => {
    const mockTx = {
      marca: { findFirst: jest.fn().mockResolvedValue(null) },
      linea: { findFirst: jest.fn().mockResolvedValue(null) },
    };

    (prisma.$transaction as jest.Mock).mockImplementation(
      (fn: TransactionFn<any>) => fn(mockTx),
    );

    await expect(
      checkUniqueName(prisma, 'linea', 'LineaNueva'),
    ).resolves.toBeUndefined();
    expect(mockTx.linea.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'lineanueva' },
    });
  });

  it('debe lanzar BadRequestException si ya existe la línea', async () => {
    const existing = { id: '1', nombre: 'lineaexistente' };
    const mockTx = {
      marca: { findFirst: jest.fn().mockResolvedValue(null) },
      linea: { findFirst: jest.fn().mockResolvedValue(existing) },
    };

    (prisma.$transaction as jest.Mock).mockImplementation(
      (fn: TransactionFn<any>) => fn(mockTx),
    );

    await expect(
      checkUniqueName(prisma, 'linea', 'LineaExistente'),
    ).rejects.toThrow(BadRequestException);
    expect(mockTx.linea.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'lineaexistente' },
    });
  });
});
