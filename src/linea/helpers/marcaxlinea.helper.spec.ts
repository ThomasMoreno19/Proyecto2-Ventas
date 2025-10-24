import { BadRequestException } from '@nestjs/common';
import { asociarMarcas } from './marcaxlinea.helper';
import { PrismaService } from '../../prisma/prisma.service';

describe('asociarMarcas helper', () => {
  let prisma: {
    marca: { findMany: jest.Mock };
    marcaXLinea: { findMany: jest.Mock; createMany: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      marca: {
        findMany: jest.fn(),
      },
      marcaXLinea: {
        findMany: jest.fn(),
        createMany: jest.fn(),
      },
    };
  });

  it('no hace nada si no se pasan marcaIds', async () => {
    await expect(
      asociarMarcas({
        prisma: prisma as unknown as PrismaService,
        lineaId: 'L1',
      }),
    ).resolves.toBeUndefined();

    expect(prisma.marca.findMany).not.toHaveBeenCalled();
    expect(prisma.marcaXLinea.createMany).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si alguna marca no existe', async () => {
    prisma.marca.findMany.mockResolvedValue([{ id: '1' }]);

    await expect(
      asociarMarcas({
        prisma: prisma as unknown as PrismaService,
        lineaId: 'L1',
        marcaIds: ['1', '2'],
      }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.marca.findMany).toHaveBeenCalledWith({
      where: { id: { in: ['1', '2'] } },
      select: { id: true },
    });
    expect(prisma.marcaXLinea.findMany).not.toHaveBeenCalled();
  });

  it('no crea relaciones si todas ya existen', async () => {
    prisma.marca.findMany.mockResolvedValue([{ id: '1' }, { id: '2' }]);
    prisma.marcaXLinea.findMany.mockResolvedValue([
      { marcaId: '1' },
      { marcaId: '2' },
    ]);

    await expect(
      asociarMarcas({
        prisma: prisma as unknown as PrismaService,
        lineaId: 'L1',
        marcaIds: ['1', '2'],
      }),
    ).resolves.toBeUndefined();

    expect(prisma.marcaXLinea.createMany).not.toHaveBeenCalled();
  });

  it('crea relaciones solo para marcas no asociadas', async () => {
    prisma.marca.findMany.mockResolvedValue([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);
    prisma.marcaXLinea.findMany.mockResolvedValue([{ marcaId: '2' }]);
    prisma.marcaXLinea.createMany.mockResolvedValue({ count: 2 });

    await asociarMarcas({
      prisma: prisma as unknown as PrismaService,
      lineaId: 'L1',
      marcaIds: ['1', '2', '3'],
    });

    expect(prisma.marcaXLinea.createMany).toHaveBeenCalledWith({
      data: [
        { lineaId: 'L1', marcaId: '1' },
        { lineaId: 'L1', marcaId: '3' },
      ],
    });
  });
});
