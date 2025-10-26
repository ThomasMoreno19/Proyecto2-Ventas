import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UpdateClienteDto } from '../dto/update-cliente.dto'; // Ajusta la ruta según tu estructura

@Injectable()
export class ValidateUpdateClientePipe
  implements PipeTransform<UpdateClienteDto, UpdateClienteDto>
{
  transform(value: UpdateClienteDto): UpdateClienteDto {
    // Crear una copia del DTO para no modificar el original directamente
    const transformedDto: UpdateClienteDto = { ...value };

    // Validar y normalizar cuil si está presente
    if (transformedDto.cuil !== undefined && transformedDto.cuil !== null) {
      transformedDto.cuil = this.validateAndNormalizeCuil(transformedDto.cuil);
    }

    // Validar y normalizar email si está presente
    if (transformedDto.email !== undefined && transformedDto.email !== null) {
      transformedDto.email = this.validateAndNormalizeEmail(transformedDto.email);
    }

    // Validar y normalizar telefono si está presente
    if (transformedDto.telefono !== undefined && transformedDto.telefono !== null) {
      transformedDto.telefono = this.validateAndNormalizeTelefono(transformedDto.telefono);
    }

    return transformedDto;
  }

  private validateAndNormalizeCuil(cuil: string): string {
    if (typeof cuil !== 'string') {
      throw new BadRequestException('El CUIL debe ser un string.');
    }

    // Verificar si hay caracteres inválidos (no numéricos y no espacios)
    const invalidChars = cuil.match(/[^0-9\s]/g);
    if (invalidChars) {
      throw new BadRequestException(
        `El CUIL contiene caracteres inválidos: "${invalidChars.join(', ')}". Solo se permiten números y espacios.`,
      );
    }

    // Normalizar: quitar espacios y dejar solo números
    const normalized = cuil.replace(/\s/g, '');

    // Validar formato
    if (!/^(20|23|24|27|30|33|34)[0-9]{8}[0-9]$/.test(normalized)) {
      throw new BadRequestException(
        `El CUIL "${cuil}" no es válido. Debe tener 11 dígitos y comenzar con 20, 23, 24, 27, 30, 33 o 34.`,
      );
    }

    return normalized;
  }

  private validateAndNormalizeEmail(email: string): string {
    if (typeof email !== 'string') {
      throw new BadRequestException('El email debe ser un string.');
    }

    // Quitar espacios al inicio/fin y todos los espacios internos
    const trimmed = email.trim();
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

    // Validación de formato razonable
    const localPartRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
    const domainPartRegex = /^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

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

  private validateAndNormalizeTelefono(telefono: string): string {
    if (typeof telefono !== 'string') {
      throw new BadRequestException('El teléfono debe ser un string.');
    }

    // Quitar espacios al inicio/fin
    const trimmed = telefono.trim();
    if (trimmed.length === 0) {
      throw new BadRequestException('El teléfono no puede estar vacío.');
    }

    // Verificar si hay caracteres inválidos (cualquier cosa que no sea 0-9 o +)
    const invalidChars = trimmed.match(/[^0-9+]/g);
    if (invalidChars) {
      throw new BadRequestException(
        `El teléfono contiene caracteres inválidos: "${invalidChars.join(', ')}". Solo se permiten números y el símbolo "+".`,
      );
    }

    // Normalizar: quitar espacios, pero mantener números y +
    const normalized = trimmed.replace(/\s+/g, '');

    // Validar longitud mínima (contando solo dígitos numéricos)
    const digitCount = (normalized.match(/[0-9]/g) || []).length;
    if (digitCount < 10) {
      throw new BadRequestException('El teléfono debe tener al menos 10 dígitos numéricos.');
    }

    return normalized;
  }
}
