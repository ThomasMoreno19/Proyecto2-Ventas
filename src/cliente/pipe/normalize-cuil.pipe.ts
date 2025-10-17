import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateCuilPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('El CUIL debe ser un string.');
    }

    // 🔹 Normalizar: quitar guiones, espacios, cualquier carácter no numérico
    const normalized = value.replace(/[^0-9]/g, '');

    // 🔹 Validar formato
    if (!/^(20|23|24|27|30|33|34)[0-9]{8}[0-9]$/.test(normalized)) {
      throw new BadRequestException(
        `El CUIL "${value}" no es válido. Debe tener 11 dígitos y comenzar con 20, 23, 24, 27, 30, 33 o 34.`,
      );
    }

    return normalized;
  }
}
