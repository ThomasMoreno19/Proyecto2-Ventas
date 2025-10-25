import { MarcaXLineaRepository } from './marcaxlinea.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('MarcaXLineaRepository', () => {
  let repo: MarcaXLineaRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      marcaXLinea: {
        createMany: jest.fn(),
      },
    } as any;

    repo = new MarcaXLineaRepository(prisma);
  });

  it('no hace nada si la lista está vacía', async () => {
    await repo.createMany([]);
    expect(prisma.marcaXLinea.createMany).not.toHaveBeenCalled();
  });

  it('crea varias relaciones si hay datos válidos', async () => {
    const data = [
      { marcaId: '1', lineaId: 'A' },
      { marcaId: '2', lineaId: 'A' },
    ];

    await repo.createMany(data);

    expect(prisma.marcaXLinea.createMany).toHaveBeenCalledWith({ data });
  });
});
