import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateEmailPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('El email debe ser un string.');
    }

    // Quitar espacios al inicio/fin y todos los espacios internos
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new BadRequestException('El email no puede estar vacío.');
    }
    const normalized = trimmed.replace(/\s+/g, '').toLowerCase();

    // Longitudes máximas razonables según RFC (local <=64, total <=254)
    if (normalized.length > 254) {
      throw new BadRequestException('El email es demasiado largo.');
    }

    const [local, domain] = normalized.split('@');
    if (!local || !domain) {
      throw new BadRequestException(
        'El email debe contener un solo "@" y partes local y dominio válidas.',
      );
    }
    if (local.length > 64) {
      throw new BadRequestException('La parte local del email (antes de @) es demasiado larga.');
    }

    // Validación de formato razonable: caracteres permitidos en local y dominio con al menos un punto en dominio
    const localPartRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
    const domainPartRegex = /^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/; // exige al menos un punto

    if (!localPartRegex.test(local)) {
      throw new BadRequestException('La parte local del email contiene caracteres inválidos.');
    }

    if (!domainPartRegex.test(domain)) {
      throw new BadRequestException(
        'El dominio del email no es válido. Debe contener al menos un punto y solo caracteres válidos.',
      );
    }

    return normalized;
  }
}
