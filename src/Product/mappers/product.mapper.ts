import { Product } from '@prisma/client';
import { ProductDto } from '../dto/product.dto';

export class ProductMapper {
  static toProductDto(product: Product): ProductDto {
    const dto: ProductDto = {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      marcaXLineaId: product.marcaXLineaId,
    };
    return dto;
  }
}
