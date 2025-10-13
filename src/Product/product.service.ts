import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { IProductRepository } from './repository/product.repository.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new producto';
  }

  findAll() {
    return `This action returns all producto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
