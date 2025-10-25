import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @ApiProperty({ example: 'Juan', description: 'Nombre del cliente', required: false })
  nombre?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @ApiProperty({ example: 'Pérez', description: 'Apellido del cliente', required: false })
  apellido?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(12)
  @ApiProperty({ example: '20123456789', description: 'CUIL del cliente', required: false })
  cuil!: string;

  @IsOptional()
  @ApiProperty({ example: '2Pd5s@example.com', description: 'Email del cliente', required: false })
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @ApiProperty({ example: '1123456789', description: 'Teléfono del cliente', required: false })
  telefono?: string;

  @IsDate()
  @ApiProperty({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Fecha de actualización del cliente',
  })
  updatedAt!: Date;
}
