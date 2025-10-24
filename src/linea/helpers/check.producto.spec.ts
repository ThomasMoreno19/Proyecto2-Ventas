import { canDelete } from './check.producto';
import { PrismaService } from '../../prisma/prisma.service';

describe('canDelete helper', () => {
  let prisma: { product: { count: jest.Mock<any, any> } };

  beforeEach(() => {
    prisma = {
      product: {
        count: jest.fn().mockResolvedValue(0),
      },
    };
  });

  it('devuelve true cuando no hay productos asociados', async () => {
    prisma.product.count.mockResolvedValue(0);

    const result = await canDelete(
      prisma as unknown as PrismaService,
      'linea123',
    );

    expect(prisma.product.count).toHaveBeenCalledWith({
      where: { lineaId: 'linea123' },
    });
    expect(result).toBe(true);
  });

  it('devuelve false cuando hay productos asociados', async () => {
    prisma.product.count.mockResolvedValue(5);

    const result = await canDelete(
      prisma as unknown as PrismaService,
      'linea123',
    );

    expect(prisma.product.count).toHaveBeenCalledWith({
      where: { lineaId: 'linea123' },
    });
    expect(result).toBe(false);
  });
});
