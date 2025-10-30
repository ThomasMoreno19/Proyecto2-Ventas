import { ApiProperty } from "@nestjs/swagger";

export class marcaXLineaDto {
    @ApiProperty({
    example: '68f0602ae29a2c2e0ff28625',
    description: 'ID de la relación Marca x Línea',
    })
    id!: string;

    @ApiProperty({
    example: 'Nike',
    description: 'Nombre de la marca',
    })
    marca!: string;

    @ApiProperty({
    example: 'Zapatillas Deportivas',
    description: 'Nombre de la línea',
    })
    linea!: string;
}