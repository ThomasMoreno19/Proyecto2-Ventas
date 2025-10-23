import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ValidatePricePipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  transform(value: unknown) {
    if (value == null) {
      throw new BadRequestException('El valor no puede ser nulo o indefinido');
    }
    if (typeof value !== 'object') {
      throw new BadRequestException('El valor debe ser un objeto');
    }
    const obj = value as Record<string, unknown>;
    if ('price' in obj) {
      const price = obj['price'];

      if (price != null && typeof price !== 'number') {
        throw new BadRequestException(
          'El precio debe ser un número o cadena numérica',
        );
      }

      const numPrice = Number(price);
      if (isNaN(numPrice)) {
        throw new BadRequestException('El precio debe ser un número válido');
      }

      if (numPrice <= 0) {
        throw new BadRequestException('El precio debe ser mayor a 0');
      }

      obj['price'] = numPrice;
    }
    return obj;
  }
}
