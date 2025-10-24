import { Product } from '@prisma/client';

export class ProductEntity implements Product {
  id!: string;
  name!: string;
  description!: string | null;
  price!: number;
  stock!: number;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
  marcaXLineaId: string | null;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
