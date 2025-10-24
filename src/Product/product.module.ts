import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repositories/product.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [PrismaService, ProductRepository, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
