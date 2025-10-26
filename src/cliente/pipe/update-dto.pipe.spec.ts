// src/cliente/pipe/update-dto.pipe.spec.ts
import { ValidateUpdateClientePipe } from './update-dto.pipe';
import { BadRequestException } from '@nestjs/common';
import { UpdateClienteDto } from '../dto/update-cliente.dto'; // Ajusta la ruta según tu estructura

describe('ValidateUpdateClientePipe', () => {
  let pipe: ValidateUpdateClientePipe;

  beforeEach(() => {
    pipe = new ValidateUpdateClientePipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should normalize valid CUIL, email, and telefono', () => {
      const dto: UpdateClienteDto = {
        cuil: '20 34567890 1',
        email: '  USER@EXAMPLE.COM  ',
        telefono: '  +54 911 1234 5678  ',
      };

      const result = pipe.transform(dto);
      expect(result).toEqual({
        cuil: '20345678901',
        email: 'user@example.com',
        telefono: '+5491112345678',
      });
    });

    it('should handle partial DTO with only CUIL', () => {
      const dto: UpdateClienteDto = { cuil: '20 34567890 1' };
      const result = pipe.transform(dto);
      expect(result).toEqual({ cuil: '20345678901' });
    });

    it('should handle partial DTO with only email', () => {
      const dto: UpdateClienteDto = { email: '  user@exam ple.com  ' };
      const result = pipe.transform(dto);
      expect(result).toEqual({ email: 'user@exam ple.com' }); // Espacios internos no se eliminan en este caso
    });

    it('should handle partial DTO with only telefono', () => {
      const dto: UpdateClienteDto = { telefono: '  911 12345678  ' };
      const result = pipe.transform(dto);
      expect(result).toEqual({ telefono: '91112345678' });
    });

    it('should throw BadRequestException for invalid CUIL', () => {
      const dto: UpdateClienteDto = { cuil: '20a345678901' };
      expect(() => pipe.transform(dto)).toThrow(BadRequestException);
      expect(() => pipe.transform(dto)).toThrow(
        'El CUIL contiene caracteres inválidos: "a". Solo se permiten números y espacios.',
      );
    });

    it('should throw BadRequestException for invalid email', () => {
      const dto: UpdateClienteDto = { email: 'user@exam_ple' };
      expect(() => pipe.transform(dto)).toThrow(BadRequestException);
      expect(() => pipe.transform(dto)).toThrow(
        'El dominio del email no es válido. Debe contener al menos un punto y solo caracteres válidos.',
      );
    });

    it('should throw BadRequestException for invalid telefono', () => {
      const dto: UpdateClienteDto = { telefono: '911a12345678' };
      expect(() => pipe.transform(dto)).toThrow(BadRequestException);
      expect(() => pipe.transform(dto)).toThrow(
        'El teléfono contiene caracteres inválidos: "a". Solo se permiten números y el símbolo "+".',
      );
    });

    it('should handle null or undefined fields', () => {
      const dto: UpdateClienteDto = { cuil: undefined, email: undefined, telefono: undefined };
      const result = pipe.transform(dto);
      expect(result).toEqual({ cuil: null, email: undefined, telefono: null });
    });
  });
});
