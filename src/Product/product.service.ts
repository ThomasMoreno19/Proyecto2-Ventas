import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { IProductRepository } from './repositories/product.repository.interface';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.repository.create(createProductDto);
  }

  findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  findOne(id: string): Promise<Product | null> {
    return this.repository.findOne(id);
  }

  update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.repository.update(id, updateProductDto);
  }

  softDelete(id: string): Promise<Product> {
    return this.repository.softDelete(id);
  }
}
