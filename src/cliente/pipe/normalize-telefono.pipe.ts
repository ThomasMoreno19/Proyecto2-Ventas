import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateTelefonoPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('El teléfono debe ser un string.');
    }

    // 🔹 Normalizar: quitar guiones, espacios, +, letras
    const normalized = value.replace(/[^0-9]/g, '');

    // 🔹 Validar longitud
    if (!/^[0-9]{10,15}$/.test(normalized)) {
      throw new BadRequestException(
        `El teléfono "${value}" no es válido. Debe tener solo números, 10 a 15 dígitos.`,
      );
    }

    return normalized; // Retorna ya normalizado
  }
}
