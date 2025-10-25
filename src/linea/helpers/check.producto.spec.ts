import { canDelete } from './check.producto';
import { PrismaService } from '../../prisma/prisma.service';

describe('canDelete helper', () => {
  let prisma: PrismaService;

  // Mock genérico para los delegates de Prisma
  const mockDelegate = () => ({
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirstOrThrow: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createMany: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  });

  beforeEach(() => {
    prisma = {
      marcaXLinea: mockDelegate(),
      product: mockDelegate(),
    } as unknown as PrismaService;
  });

  it('devuelve true si no existe MarcaXLinea para la línea', async () => {
    (prisma.marcaXLinea.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await canDelete(prisma, 'linea123');
    expect(result).toBe(true);
    expect(prisma.marcaXLinea.findFirst).toHaveBeenCalledWith({
      where: { lineaId: 'linea123' },
    });
  });

  it('devuelve true si no hay productos asociados', async () => {
    (prisma.marcaXLinea.findFirst as jest.Mock).mockResolvedValue({
      id: 'mx1',
      lineaId: 'linea123',
    });
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      { id: 'p1', marcaXLineaId: 'mx2' },
      { id: 'p2', marcaXLineaId: 'mx3' },
    ]);

    const result = await canDelete(prisma, 'linea123');
    expect(result).toBe(true);
  });

  it('devuelve false si hay productos asociados', async () => {
    (prisma.marcaXLinea.findFirst as jest.Mock).mockResolvedValue({
      id: 'mx1',
      lineaId: 'linea123',
    });
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      { id: 'p1', marcaXLineaId: 'mx1' },
      { id: 'p2', marcaXLineaId: 'mx2' },
    ]);

    const result = await canDelete(prisma, 'linea123');
    expect(result).toBe(false);
  });
});
