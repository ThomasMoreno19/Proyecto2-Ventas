import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '@prisma/client';

// --- Datos de Mocks Reutilizables ---
const mockDate = new Date(); // Mock de la fecha actual para consistencia en softDelete
const mockProductId = 'product-1';

const mockProduct: Product = {
  id: mockProductId,
  nombre: 'Laptop Dell XPS 13',
  descripcion: 'Una laptop ultradelgada y potente',
  precio: 1000,
  stock: 50,
  marcaXLineaId: 'mxl-123',
  createdAt: mockDate,
  updatedAt: mockDate,
  deletedAt: null,
};

const mockCreateProductDto: CreateProductDto = {
  nombre: 'Nuevo Producto',
  descripcion: 'Descripción de prueba',
  precio: 500,
  stock: 10,
  marcaXLineaId: 'mxl-test',
};

const mockUpdateProductDto: UpdateProductDto = {
  precio: 1200,
  stock: 60,
};

const prismaMock = {
  // Usamos 'jest.fn()' para simular los métodos que el repositorio llama
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

// Tipamos el objeto mock de Prisma para el uso local
type MockPrismaService = typeof prismaMock;

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let prisma: jest.Mocked<MockPrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.product.create with correct data and return the new product', async () => {
      // Mockeamos el valor de retorno de Prisma
      prisma.product.create.mockResolvedValue(mockProduct as any);

      const result = await repository.create(mockCreateProductDto);

      // Verificamos que Prisma fue llamado correctamente
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          nombre: mockCreateProductDto.nombre,
          descripcion: mockCreateProductDto.descripcion,
          precio: mockCreateProductDto.precio,
          stock: mockCreateProductDto.stock,
          marcaXLineaId: mockCreateProductDto.marcaXLineaId,
          deletedAt: null,
        },
      });
      // Verificamos el valor de retorno
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return a list of active products', async () => {
      const deletedProduct: Product = { ...mockProduct, id: 'deleted-2', deletedAt: new Date() };
      const activeProducts: Product[] = [mockProduct, { ...mockProduct, id: 'active-3' }];

      // Simula que Prisma devuelve productos activos y eliminados
      prisma.product.findMany.mockResolvedValue([...activeProducts, deletedProduct] as any);

      const result = await repository.findAll();

      // Verifica que solo se llamó a findMany (sin filtro en la query)
      expect(prisma.product.findMany).toHaveBeenCalled();
      // Verifica que el filtro interno del repositorio funcionó
      expect(result).toEqual(activeProducts);
    });

    it('should return an empty array if no active products exist', async () => {
      // Simula que Prisma devuelve solo productos eliminados
      const deletedProduct: Product = { ...mockProduct, id: 'deleted-2', deletedAt: new Date() };
      prisma.product.findMany.mockResolvedValue([deletedProduct] as any);

      const result = await repository.findAll();

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return an empty array if Prisma returns an empty list', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return the product if it exists and is not deleted', async () => {
      prisma.product.findFirst.mockResolvedValue(mockProduct as any);

      const result = await repository.findOne(mockProductId);

      expect(prisma.product.findFirst).toHaveBeenCalledWith({ where: { id: mockProductId } });
      expect(result).toEqual(mockProduct);
    });

    it('should return null if the product is not found', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      const result = await repository.findOne(mockProductId);

      expect(result).toBeNull();
    });

    it('should return null if the product is soft deleted', async () => {
      const deletedProduct: Product = { ...mockProduct, deletedAt: mockDate };
      prisma.product.findFirst.mockResolvedValue(deletedProduct as any);

      const result = await repository.findOne(mockProductId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should call prisma.product.update and return the updated product', async () => {
      // 1. Simula que `findFirst` encuentra el producto activo
      prisma.product.findFirst.mockResolvedValue(mockProduct as any);
      // 2. Simula que `update` devuelve el producto modificado
      const updatedProduct: Product = { ...mockProduct, ...mockUpdateProductDto };
      prisma.product.update.mockResolvedValue(updatedProduct as any);

      const result = await repository.update(mockProductId, mockUpdateProductDto);

      // Verificamos la llamada a `findFirst` (para la validación)
      expect(prisma.product.findFirst).toHaveBeenCalledWith({ where: { id: mockProductId } });
      // Verificamos la llamada a `update`
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: mockProductId },
        data: mockUpdateProductDto,
      });
      expect(result).toEqual(updatedProduct);
    });

    it('should throw an error if the product is not found', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(repository.update(mockProductId, mockUpdateProductDto)).rejects.toThrow(
        `El producto con id ${mockProductId} no existe`,
      );
      // Verificamos que update no fue llamado
      expect(prisma.product.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the product is soft deleted', async () => {
      const deletedProduct: Product = { ...mockProduct, deletedAt: mockDate };
      prisma.product.findFirst.mockResolvedValue(deletedProduct as any);

      await expect(repository.update(mockProductId, mockUpdateProductDto)).rejects.toThrow(
        `El producto con id ${mockProductId} no existe`,
      );
      // Verificamos que update no fue llamado
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    let dateSpy: jest.SpyInstance;

    beforeEach(() => {
      // Configuramos el spy ANTES de ejecutar el test que lo usa
      dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    });

    afterEach(() => {
      // Restauramos el spy de Date DESPUÉS de cada test de este describe
      dateSpy.mockRestore();
    });

    it('should call prisma.product.update to set deletedAt', async () => {
      prisma.product.findFirst.mockResolvedValue(mockProduct as any);
      // Simula que `update` se ejecuta sin error
      prisma.product.update.mockResolvedValue({} as any);

      // Aseguramos que la fecha se usa en la aserción
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      await expect(repository.softDelete(mockProductId)).resolves.toBeUndefined();

      // Verificamos la llamada a `findFirst`
      expect(prisma.product.findFirst).toHaveBeenCalledWith({ where: { id: mockProductId } });
      // Verificamos la llamada a `update` con la fecha actual
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: mockProductId },
        data: {
          deletedAt: mockDate,
        },
      });
    });

    it('should throw an error if the product is not found', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(repository.softDelete(mockProductId)).rejects.toThrow(
        `El producto con id ${mockProductId} no existe`,
      );
      expect(prisma.product.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the product is already soft deleted', async () => {
      const deletedProduct: Product = { ...mockProduct, deletedAt: mockDate };
      prisma.product.findFirst.mockResolvedValue(deletedProduct as any);

      await expect(repository.softDelete(mockProductId)).rejects.toThrow(
        `El producto con id ${mockProductId} no existe`,
      );
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });
});
