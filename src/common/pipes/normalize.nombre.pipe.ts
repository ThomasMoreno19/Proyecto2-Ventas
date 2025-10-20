import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

// Recibe un DTO y normaliza el campo 'nombre' (lo pone en minusculas y sin espacios)
@Injectable()
export class NormalizePipe implements PipeTransform {
  transform(value: unknown) {
    if (value == null) {
      return value;
    }

    if (typeof value !== 'object') {
      return value;
    }

    const obj = value as Record<string, unknown>;

    if ('nombre' in obj) {
      const nombre = obj['nombre'];

      if (nombre != null && typeof nombre !== 'string') {
        throw new BadRequestException('El nombre debe ser una cadena de texto');
      }

      if (typeof nombre === 'string') {
        const normalizedValue = nombre.trim().toLowerCase();
        if (normalizedValue.length === 0) {
          throw new BadRequestException('El nombre no puede estar vacío');
        }
        obj['nombre'] = normalizedValue;
      }
    }

    return value;
  }
}
