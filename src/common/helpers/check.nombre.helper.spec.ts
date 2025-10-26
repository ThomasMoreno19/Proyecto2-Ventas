import { BadRequestException } from '@nestjs/common';
import { checkUniqueName } from './check.nombre.helper';
import { PrismaService } from 'src/prisma/prisma.service';

describe('checkUniqueName helper', () => {
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      marca: { findFirst: jest.fn() },
      linea: { findFirst: jest.fn() },
    } as any;
  });

  it('debe resolver si no existe ninguna marca con ese nombre', async () => {
    (prisma.marca.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(
      checkUniqueName(prisma, 'marca', 'NuevaMarca'),
    ).resolves.toBeUndefined();

    expect(prisma.marca.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'nuevamarca' },
    });
  });

  it('debe lanzar BadRequestException si ya existe la marca', async () => {
    (prisma.marca.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
      nombre: 'marcaexistente',
    });

    await expect(
      checkUniqueName(prisma, 'marca', 'MarcaExistente'),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.marca.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'marcaexistente' },
    });
  });

  it('debe resolver si no existe ninguna línea con ese nombre', async () => {
    (prisma.linea.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(
      checkUniqueName(prisma, 'linea', 'LineaNueva'),
    ).resolves.toBeUndefined();

    expect(prisma.linea.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'lineanueva' },
    });
  });

  it('debe lanzar BadRequestException si ya existe la línea', async () => {
    (prisma.linea.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
      nombre: 'lineaexistente',
    });

    await expect(
      checkUniqueName(prisma, 'linea', 'LineaExistente'),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.linea.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'lineaexistente' },
    });
  });
});
