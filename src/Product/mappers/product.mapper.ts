import { Product } from "@prisma/client";
import { CreateProductDto } from "../dto/create-product.dto";


export class ProductMapper {
    static toProductDto (product: Product): CreateProductDto {
        const {  id, description, createdAt, updatedAt, deletedAt, marcaXLineaId, ...rest } = product;
        
        return {
            ...rest,
            description: description || undefined,
            marcaXLineaId: product.marcaXLineaId || undefined,
        };
    }
}
