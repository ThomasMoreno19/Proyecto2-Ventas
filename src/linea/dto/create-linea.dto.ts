import { ApiProperty } from '@nestjs/swagger';

export class CreateLineaDto {
<<<<<<< HEAD
  nombre: string;
=======
  @ApiProperty({
    example: 'Ropa deportiva',
    description: 'Nombre de la línea',
    required: true,
  })
  nombre: string;

  @ApiProperty({
    example: 'Ropa para hacer deporte',
    description: 'Descripción de la línea',
    required: false,
  })
>>>>>>> 0ef94826c494c445fdbbee0e15304ee07878d50f
  descripcion?: string;
}
