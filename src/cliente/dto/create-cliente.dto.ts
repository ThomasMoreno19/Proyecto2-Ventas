import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { MaxLength, IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @ApiProperty({ example: 'Juan', description: 'Nombre del cliente' })
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @ApiProperty({ example: 'Pérez', description: 'Apellido del cliente' })
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(12)
  @ApiProperty({ example: '20123456789', description: 'CUIL del cliente' })
  cuil!: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: '2Pd5s@example.com', description: 'Email del cliente' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty({ example: '1123456789', description: 'Teléfono del cliente' })
  telefono!: string;
}
