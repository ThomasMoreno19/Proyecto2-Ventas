import { IsString, IsNumber, IsOptional, IsInt, Min, IsNotEmpty } from 'class-validator';

export class ProductDto {
 
    @IsString()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsInt()
    @Min(0)
    stock: number;

    @IsOptional()
    @IsString()
    marcaXLineaId?: string;

}


