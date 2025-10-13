import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repository/product.repository';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService,
    {
      provide: 'IProductRepository',
      useValue: ProductRepository,
    }
  ],
  exports: [TypeOrmModule, ProductService], 
})
export class ProductModule {}
