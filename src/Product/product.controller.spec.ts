import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { BadRequestException, NotFoundException, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationError } from 'class-validator';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

const MockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  const mockProductService = {
    create: jest.fn((dto: CreateProductDto) =>
      Promise.resolve({
        id: '1',
        ...dto,
        stock: Math.floor(dto.stock),
      } as ProductDto),
    ),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn((id: string, dto: UpdateProductDto) =>
      Promise.resolve({
        id,
        ...dto,
        stock: Math.floor(dto.stock || 50),
        descripcion: 'Una laptop ultradelgada',
        marcaXLineaId: 'marca-linea-123',
      } as ProductDto),
    ),
    softDelete: jest.fn(),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const applyValidationPipe = async <T>(
    dto: unknown,
    metatype: { new (...args: any[]): T },
  ): Promise<T> => {
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
    });
    const transformedDto = await validationPipe.transform(dto, { type: 'body', metatype });
    return transformedDto as T;
  };

  describe('create', () => {
    it('should create a product with valid data', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };
      const expectedResult: ProductDto = {
        id: '1',
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };

      const serviceSpy = jest.spyOn(productService, 'create').mockResolvedValue(expectedResult);
      const validatedDto = await applyValidationPipe(createProductDto, CreateProductDto);
      const result = await controller.create(validatedDto);

      expect(serviceSpy).toHaveBeenCalledWith(validatedDto);
      expect(result).toEqual(expectedResult);
    });

    it('should create a product with minimum price (0)', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 0,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };
      const expectedResult: ProductDto = {
        id: '1',
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 0,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };

      const serviceSpy = jest.spyOn(productService, 'create').mockResolvedValue(expectedResult);
      const validatedDto = await applyValidationPipe(createProductDto, CreateProductDto);
      const result = await controller.create(validatedDto);

      expect(serviceSpy).toHaveBeenCalledWith(validatedDto);
      expect(result).toEqual(expectedResult);
    });

    it('should fail with negative price', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: -1,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };

      await expect(applyValidationPipe(createProductDto, CreateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a product with minimum stock (0)', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: 0,
        marcaXLineaId: 'marca-linea-123',
      };
      const expectedResult: ProductDto = {
        id: '1',
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: 0,
        marcaXLineaId: 'marca-linea-123',
      };

      const serviceSpy = jest.spyOn(productService, 'create').mockResolvedValue(expectedResult);
      const validatedDto = await applyValidationPipe(createProductDto, CreateProductDto);
      const result = await controller.create(validatedDto);

      expect(serviceSpy).toHaveBeenCalledWith(validatedDto);
      expect(result).toEqual(expectedResult);
    });

    it('should fail with negative stock', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: -1,
        marcaXLineaId: 'marca-linea-123',
      };

      await expect(applyValidationPipe(createProductDto, CreateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with non-number price', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 'invalid' as any,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };

      await expect(applyValidationPipe(createProductDto, CreateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with non-number stock', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: 'invalid' as any,
        marcaXLineaId: 'marca-linea-123',
      };

      await expect(applyValidationPipe(createProductDto, CreateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with invalid price and stock', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: -1,
        stock: -1,
        marcaXLineaId: 'marca-linea-123',
      };

      await expect(applyValidationPipe(createProductDto, CreateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with empty nombre after trim', async () => {
      const createProductDto: CreateProductDto = {
        nombre: '',
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };

      await expect(applyValidationPipe(createProductDto, CreateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with non-string nombre', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 123 as any,
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };

      await expect(applyValidationPipe(createProductDto, CreateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no products exist', async () => {
      jest.spyOn(productService, 'findAll').mockResolvedValue([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });

    it('should return a list of products', async () => {
      const expectedResult: ProductDto[] = [
        {
          id: '1',
          nombre: 'laptop dell xps 13',
          descripcion: 'Una laptop ultradelgada',
          precio: 1000,
          stock: 50,
          marcaXLineaId: 'marca-linea-123',
        },
      ];
      jest.spyOn(productService, 'findAll').mockResolvedValue(expectedResult);
      const result = await controller.findAll();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a product with valid ID', async () => {
      const productId = '1';
      const expectedResult: ProductDto = {
        id: '1',
        nombre: 'laptop dell xps 13',
        descripcion: 'Una laptop ultradelgada',
        precio: 1000,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };

      const serviceSpy = jest.spyOn(productService, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(productId);

      expect(serviceSpy).toHaveBeenCalledWith(productId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException for invalid ID', async () => {
      const productId = '999';

      jest
        .spyOn(productService, 'findOne')
        .mockRejectedValue(new NotFoundException('Producto con id 999 no encontrado'));

      await expect(controller.findOne(productId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product with partial valid data', async () => {
      const productId = '1';
      const updateProductDto: UpdateProductDto = {
        nombre: 'updated laptop',
        precio: 1500,
      };
      const expectedResult: ProductDto = {
        id: '1',
        nombre: 'updated laptop',
        descripcion: 'Una laptop ultradelgada',
        precio: 1500,
        stock: 50,
        marcaXLineaId: 'marca-linea-123',
      };

      const serviceSpy = jest.spyOn(productService, 'update').mockResolvedValue(expectedResult);
      const validatedDto = await applyValidationPipe(updateProductDto, UpdateProductDto);
      const result = await controller.update(productId, validatedDto);

      expect(serviceSpy).toHaveBeenCalledWith(productId, validatedDto);
      expect(result).toEqual(expectedResult);
    });

    it('should fail with negative price in update', async () => {
      const updateProductDto: UpdateProductDto = {
        precio: -1,
      };

      await expect(applyValidationPipe(updateProductDto, UpdateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with negative stock in update', async () => {
      const updateProductDto: UpdateProductDto = {
        stock: -1,
      };

      await expect(applyValidationPipe(updateProductDto, UpdateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with non-number price in update', async () => {
      const updateProductDto: UpdateProductDto = {
        precio: 'invalid' as any,
      };

      await expect(applyValidationPipe(updateProductDto, UpdateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with non-number stock in update', async () => {
      const updateProductDto: UpdateProductDto = {
        stock: 'invalid' as any,
      };

      await expect(applyValidationPipe(updateProductDto, UpdateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should fail with empty nombre in update', async () => {
      const updateProductDto: UpdateProductDto = {
        nombre: '',
      };

      await expect(applyValidationPipe(updateProductDto, UpdateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete an existing product', async () => {
      const productId = '1';

      const serviceSpy = jest.spyOn(productService, 'softDelete').mockResolvedValue(undefined);

      await expect(controller.softDelete(productId)).resolves.toBeUndefined();
      expect(serviceSpy).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException for non-existent product', async () => {
      const productId = '999';

      jest
        .spyOn(productService, 'softDelete')
        .mockRejectedValue(new NotFoundException('Producto con id 999 no encontrado'));

      await expect(controller.softDelete(productId)).rejects.toThrow(NotFoundException);
    });
  });
});
