import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './repositories/product.repository';
import { ProductMapper } from './mappers/product.mapper';
import { ProductDto } from './dto/product.dto';
import { checkUniqueName } from 'src/common/helpers/check.nombre.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    await checkUniqueName(this.prisma, 'product', createProductDto.nombre);

    const producto = await this.repository.create(createProductDto);
    return ProductMapper.toProductDto(producto);
  }

  async findAll(): Promise<ProductDto[]> {
    const productos = await this.repository.findAll();
    return productos.map((p) => ProductMapper.toProductDto(p));
  }

  async findOne(id: string): Promise<ProductDto | null> {
    const producto = await this.repository.findOne(id);
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return ProductMapper.toProductDto(producto);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDto> {
    const producto = await this.repository.update(id, updateProductDto);
    return ProductMapper.toProductDto(producto);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
