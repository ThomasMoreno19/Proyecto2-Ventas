import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { checkUniqueName } from 'src/common/helpers/check.nombre.helper';

jest.mock('../common/helpers/check.nombre.helper');

// --- Datos de Mocks ---
const mockProductRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const mockProduct: Product = {
  id: 'product-1',
  nombre: 'Laptop Dell XPS 13',
  descripcion: 'Una laptop ultradelgada y potente',
  precio: 1000,
  stock: 50,
  marcaXLineaId: 'mxl-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockProductDto: ProductDto = {
  id: 'product-1',
  nombre: 'Laptop Dell XPS 13',
  descripcion: 'Una laptop ultradelgada y potente',
  precio: 1000,
  stock: 50,
  marcaXLineaId: 'mxl-123',
};

const mockPrismaService = {};

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: jest.Mocked<typeof mockProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    // Caso de Partición Equivalente: Datos Válidos
    it('should create a product successfully and return ProductDto', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'Laptop Dell XPS 13',
        descripcion: 'Una laptop ultradelgada y potente',
        precio: 1000,
        stock: 50,
        marcaXLineaId: 'mxl-123',
      };
      const createdProduct: Product = {
        ...mockProduct,
        id: 'product-1',
        ...createProductDto,
      };

      // Simula que la validación de nombre único no lanza un error
      (checkUniqueName as jest.Mock).mockResolvedValue(undefined);
      productRepository.create.mockResolvedValue(createdProduct);

      const result = await service.create(createProductDto);

      // Verificaciones corregidas:
      expect(checkUniqueName).toHaveBeenCalledWith(
        mockPrismaService,
        'product',
        createProductDto.nombre,
      );
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(
        expect.objectContaining({
          id: 'product-1',
          nombre: createProductDto.nombre,
          precio: createProductDto.precio,
        } as ProductDto),
      );
    });

    // Caso de Partición Equivalente: Nombre duplicado (Error)
    it('should throw an error if the product name is not unique', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'Producto Existente',
        descripcion: 'Una descripción',
        precio: 500,
        stock: 20,
        marcaXLineaId: 'mxl-456',
      };

      const uniqueError = new Error('Nombre "Producto Existente" ya existe.');
      (checkUniqueName as jest.Mock).mockRejectedValue(uniqueError);

      await expect(service.create(createProductDto)).rejects.toThrow(uniqueError);

      // Verificación: El repositorio NO debe ser llamado si la validación falla
      expect(productRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    // Caso de Partición Equivalente: Lista de productos
    it('should return a list of ProductDto when products exist', async () => {
      const products: Product[] = [mockProduct];
      const expectedDtos: ProductDto[] = [mockProductDto];

      // Usando 'repository.findAll.mockResolvedValue' gracias a jest.Mocked<T>
      productRepository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(productRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedDtos);
    });

    // Caso de Partición Equivalente: Lista vacía
    it('should return an empty array when no products exist', async () => {
      productRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(productRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const productId = 'product-1';

    // Caso de Partición Equivalente: Producto existente
    it('should return a ProductDto when a product with the given ID exists', async () => {
      productRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne(productId);

      expect(productRepository.findOne).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProductDto);
    });

    // Caso de Partición Equivalente: Producto no existente
    it('should throw NotFoundException when product does not exist', async () => {
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(productId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(productId)).rejects.toThrow(
        `Producto con id ${productId} no encontrado`,
      );
      expect(productRepository.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('update', () => {
    const productId = 'product-1';
    const updateProductDto: UpdateProductDto = {
      precio: 1200,
      stock: 60,
    };

    const updatedProduct: Product = {
      ...mockProduct,
      precio: 1200,
      stock: 60,
    };

    const expectedDto: ProductDto = {
      ...mockProductDto,
      precio: 1200,
      stock: 60,
    };

    // Caso de Partición Equivalente: Actualización exitosa
    it('should update a product and return the updated ProductDto', async () => {
      productRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, updateProductDto);

      expect(productRepository.update).toHaveBeenCalledWith(productId, updateProductDto);
      expect(result).toEqual(expectedDto);
    });

    // Caso de Partición Equivalente/Error: Producto no existente (se espera que el repositorio lance el error)
    it('should propagate the error if the product to update does not exist', async () => {
      const repoError = new Error(`El producto con id ${productId} no existe`);
      productRepository.update.mockRejectedValue(repoError);

      await expect(service.update(productId, updateProductDto)).rejects.toThrow(repoError);
      expect(productRepository.update).toHaveBeenCalledWith(productId, updateProductDto);
    });

    // Análisis de Valores Límites
    it('should update the product with minimum valid price (0) and stock (0)', async () => {
      const boundaryUpdateDto: UpdateProductDto = { precio: 0, stock: 0 };
      const updatedBoundaryProduct: Product = { ...mockProduct, precio: 0, stock: 0 };
      const expectedBoundaryDto: ProductDto = { ...mockProductDto, precio: 0, stock: 0 };

      productRepository.update.mockResolvedValue(updatedBoundaryProduct);

      const result = await service.update(productId, boundaryUpdateDto);

      expect(productRepository.update).toHaveBeenCalledWith(productId, boundaryUpdateDto);
      expect(result).toEqual(expectedBoundaryDto);
    });
  });

  describe('softDelete', () => {
    const productId = 'product-1';

    // Caso de Partición Equivalente: Eliminación exitosa
    it('should successfully soft delete a product', async () => {
      productRepository.softDelete.mockResolvedValue(undefined);

      await expect(service.softDelete(productId)).resolves.toBeUndefined();
      expect(productRepository.softDelete).toHaveBeenCalledWith(productId);
    });

    // Caso de Partición Equivalente/Error: Producto no existente
    it('should propagate the error if the product to soft delete does not exist', async () => {
      const repoError = new Error(`El producto con id ${productId} no existe`);
      productRepository.softDelete.mockRejectedValue(repoError);

      await expect(service.softDelete(productId)).rejects.toThrow(repoError);
      expect(productRepository.softDelete).toHaveBeenCalledWith(productId);
    });
  });
});
