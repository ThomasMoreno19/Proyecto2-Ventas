import { Transform } from 'class-transformer';
import {
  MaxLength,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmail,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(12)
  cuil!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  telefono!: string;
}
