import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({ example: 'John', description: 'User name' })
  name!: string;

  @IsEmail()
  @Transform(({ value }: { value: unknown }): string => {
    if (typeof value === 'string') {
      return value.trim().toLowerCase();
    }
    return '';
  })
  @ApiProperty({ example: '2Pd5s@example.com', description: 'User email address' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  password!: string;
}
