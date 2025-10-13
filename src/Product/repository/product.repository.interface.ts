import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { FindManyOptions } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductRepository {
  create(data: CreateProductDto): Promise<ProductEntity>;
  findAll(): Promise<any[]>;
  findOne(id: number): Promise<ProductEntity | null>;
  update(id: number, data: UpdateProductDto): Promise<ProductEntity>;
  remove(data: ProductEntity): Promise<ProductEntity>;
  findBy(id: number, skip: number, take: number): Promise<Pagination<ProductEntity>>;
  //Promise<{ data: ProductEntity[], count: number }>
}