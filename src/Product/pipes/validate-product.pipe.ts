import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class ValidateProductPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(ValidateProductPipe.name);

  transform(value: unknown) {
    this.logger.log(`Transforming value: ${JSON.stringify(value)}`);
    if (value == null) {
      throw new BadRequestException('El valor no puede ser nulo o indefinido');
    }
    if (typeof value !== 'object') {
      throw new BadRequestException('El valor debe ser un objeto');
    }
    const obj = value as Record<string, unknown>;
    // Validate price
    if ('precio' in obj) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.logger.log(`Validating price: ${obj['precio']}`);
      const price = obj['precio'];

      if (price != null && typeof price !== 'number') {
        throw new BadRequestException('El precio debe ser un número o cadena numérica');
      }

      const numPrice = Number(price);
      if (isNaN(numPrice)) {
        throw new BadRequestException('El precio debe ser un número válido');
      }

      if (numPrice < 0) {
        throw new BadRequestException('El precio debe ser mayor o igual a 0');
      }

      obj['precio'] = numPrice;
    }
    // Validate stock
    if ('stock' in obj) {
      const stock = obj['stock'];

      if (stock != null && typeof stock !== 'number') {
        throw new BadRequestException('El stock debe ser un número');
      }

      const numStock = Number(stock);
      if (isNaN(numStock)) {
        throw new BadRequestException('El stock debe ser un número válido');
      }

      if (numStock < 0) {
        throw new BadRequestException('El stock debe ser mayor o igual a 0');
      }

      obj['stock'] = Math.floor(numStock); // Ensure stock is an integer
    }
    return obj;
  }
}
