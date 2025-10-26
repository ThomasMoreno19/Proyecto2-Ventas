// src/cliente/pipe/normalize-cuil.pipe.spec.ts
import { ValidateCuilPipe } from './normalize-cuil.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ValidateCuilPipe', () => {
  let pipe: ValidateCuilPipe;

  beforeEach(() => {
    pipe = new ValidateCuilPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should normalize a valid CUIL with spaces', () => {
      const result = pipe.transform('20 34567890 1');
      expect(result).toBe('20345678901');
    });

    it('should accept a valid CUIL without spaces', () => {
      const result = pipe.transform('20345678901');
      expect(result).toBe('20345678901');
    });

    it('should throw BadRequestException for non-string input', () => {
      expect(() => pipe.transform(123 as any)).toThrow(BadRequestException);
      expect(() => pipe.transform(123 as any)).toThrow('El CUIL debe ser un string.');
    });

    it('should throw BadRequestException for invalid characters', () => {
      expect(() => pipe.transform('20a345678901')).toThrow(BadRequestException);
      expect(() => pipe.transform('20a345678901')).toThrow(
        'El CUIL contiene caracteres inválidos: "a". Solo se permiten números y espacios.',
      );
    });

    it('should throw BadRequestException for invalid format', () => {
      expect(() => pipe.transform('12345678901')).toThrow(BadRequestException);
      expect(() => pipe.transform('12345678901')).toThrow(
        'El CUIL "12345678901" no es válido. Debe tener 11 dígitos y comenzar con 20, 23, 24, 27, 30, 33 o 34.',
      );
    });

    it('should throw BadRequestException for wrong length', () => {
      expect(() => pipe.transform('2034567890')).toThrow(BadRequestException);
      expect(() => pipe.transform('203456789012')).toThrow(BadRequestException);
    });
  });
});
