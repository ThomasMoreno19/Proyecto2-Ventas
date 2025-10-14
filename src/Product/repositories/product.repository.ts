import { Injectable } from '@nestjs/common';
import { IProductRepository } from './product.repository.interface';
import prisma from '../../lib/db';  
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '@prisma/client';
import { ProductEntity } from '../entities/product.entity';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductRepository implements IProductRepository {
    create(data: CreateProductDto): Promise<Product> {
        return prisma.product.create({data});
    }

    findAll(): Promise<Product[]> {
        return prisma.product.findMany({ 
            where: { deletedAt: null} 
        });
    }
    findOne(id: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id, deletedAt: null },
        });   
    }
    update(id: string, data: UpdateProductDto): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    softDelete(id: string): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}