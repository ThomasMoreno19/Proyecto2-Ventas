import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ValidateProductPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: any) {
    //Validación del precio
    if (value?.price !== undefined) {
      const price = Number(value.price);

      if (isNaN(price)) {
        throw new BadRequestException('El precio debe ser un número válido');
      }

      if (price <= 0) {
        throw new BadRequestException('El precio debe ser mayor a 0');
      }
    }

    //Validación del stock
    if (value?.stock !== undefined) {
      const stock = Number(value.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        throw new BadRequestException('El stock debe ser un número entero positivo o cero');
      }
    }

    //Validación del nombre
    if (value?.name !== undefined) {
        const normalized = value.name.trim();
        if (normalized.length === 0) {
            throw new BadRequestException('El nombre no puede estar vacío');
        }
        value.name = normalized;
    }
    // Si todo está correcto, se devuelve el valor para que siga el flujo
    return value;
}
}
