import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

// Recibe un DTO y normaliza el campo 'nombre' (lo pone en minusculas y sin espacios)
@Injectable()
export class NormalizePipe implements PipeTransform {
  transform(value: any) {
    if (value?.nombre && typeof value.nombre !== 'string') {
      throw new BadRequestException('El nombre debe ser una cadena de texto');
    }

    if (value?.nombre) {
      const normalzedValue = value.nombre.trim().toLowerCase();
      if (normalzedValue.length === 0) {
        throw new BadRequestException('El nombre no puede estar vacío');
        }
      value.nombre = normalzedValue;
    }

    return value;
  }
}
