import { Product } from "@prisma/client";
import { ProductDto } from "../dto/product.dto";


export class ProductMapper {
    static toProductDto (product: Product): ProductDto {
        const { description, createdAt, updatedAt, deletedAt, marcaXLineaId, ...rest } = product;
        
        return {
            ...rest,
            description: description || undefined,
            marcaXLineaId: product.marcaXLineaId || undefined,
        };
    }
}
