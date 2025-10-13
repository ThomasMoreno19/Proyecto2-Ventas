import { IsString, IsNumber, IsOptional, IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
    @Type(() => Number)
    @IsInt()
    id: number;

    @IsString()
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
}