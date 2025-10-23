import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateTelefonoPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('El teléfono debe ser un string.');
    }

    // Verificar si hay caracteres inválidos (no numéricos y no espacios)
    const invalidChars = value.match(/[^0-9\s]/g);
    if (invalidChars) {
      throw new BadRequestException(
        `El teléfono contiene caracteres inválidos: "${invalidChars.join(', ')}". Solo se permiten números y espacios.`,
      );
    }

    // Normalizar: quitar espacios y dejar solo números
    const normalized = value.replace(/\s/g, '');

    // Validar longitud
    if (!/^[0-9]{10,15}$/.test(normalized)) {
      throw new BadRequestException(
        `El teléfono "${value}" no es válido. Debe tener solo números y entre 10 y 15 dígitos.`,
      );
    }

    return normalized; // Retorna ya normalizado
  }
}
