import { IsString, IsNumber, IsOptional, IsInt, Min, IsArray, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
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
    @IsInt()
    lineId?: number;

    @IsOptional()
    @IsInt()
    brandId?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[]; // URLs o paths de las imágenes

    createdAt?: Date;
}
