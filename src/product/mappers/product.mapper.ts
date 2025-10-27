import { Product } from '@prisma/client';
import { ProductDto } from '../dto/product.dto';

export class ProductMapper {
  static toProductDto(product: Product): ProductDto {
    const dto: ProductDto = {
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion ?? undefined,
      precio: product.precio,
      stock: product.stock,
      marcaXLineaId: product.marcaXLineaId,
    };
    return dto;
  }
}
