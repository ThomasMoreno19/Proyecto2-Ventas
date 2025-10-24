import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateCuilPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('El CUIL debe ser un string.');
    }

    // Verificar si hay caracteres inválidos (no numéricos y no espacios)
    const invalidChars = value.match(/[^0-9\s]/g);
    if (invalidChars) {
      throw new BadRequestException(
        `El CUIL contiene caracteres inválidos: "${invalidChars.join(', ')}". Solo se permiten números y espacios.`,
      );
    }

    // Normalizar: quitar espacios y dejar solo números
    const normalized = value.replace(/\s/g, '');

    // Validar formato
    if (!/^(20|23|24|27|30|33|34)[0-9]{8}[0-9]$/.test(normalized)) {
      throw new BadRequestException(
        `El CUIL "${value}" no es válido. Debe tener 11 dígitos y comenzar con 20, 23, 24, 27, 30, 33 o 34.`,
      );
    }

    return normalized;
  }
}
