import { Injectable } from '@nestjs/common';
import { IProductRepository } from './product.repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        marcaXLineaId: data.marcaXLineaId,
        deletedAt: null, // explícito
      },
    });
  }

  async findAll(): Promise<Product[]> {
    const productos = await this.prisma.product.findMany();
    return productos.filter((producto) => !producto.deletedAt);
  }

  async findOne(id: string): Promise<Product | null> {
    const producto = await this.prisma.product.findFirst({
      where: { id },
    });

    if (!producto || producto.deletedAt) {
      return null;
    }

    return producto;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const producto = await this.prisma.product.findFirst({
      where: { id },
    });

    if (!producto || producto.deletedAt) {
      throw new Error(`El producto con id ${id} no existe`);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    const producto = await this.prisma.product.findFirst({
      where: { id },
    });

    if (!producto || producto.deletedAt) {
      throw new Error(`El producto con id ${id} no existe`);
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
