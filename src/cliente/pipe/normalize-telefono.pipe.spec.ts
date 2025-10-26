// src/cliente/pipe/normalize-telefono.pipe.spec.ts
import { ValidateTelefonoPipe } from './normalize-telefono.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ValidateTelefonoPipe', () => {
  let pipe: ValidateTelefonoPipe;

  beforeEach(() => {
    pipe = new ValidateTelefonoPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should normalize a valid phone number with spaces', () => {
      const result = pipe.transform('  54 911 1234 5678  ');
      expect(result).toBe('5491112345678');
    });

    it('should accept a valid phone number with +', () => {
      const result = pipe.transform('+54 911 12345678');
      expect(result).toBe('+5491112345678');
    });

    it('should throw BadRequestException for non-string input', () => {
      expect(() => pipe.transform(123 as any)).toThrow(BadRequestException);
      expect(() => pipe.transform(123 as any)).toThrow('El teléfono debe ser un string.');
    });

    it('should throw BadRequestException for invalid characters', () => {
      expect(() => pipe.transform('54a91112345678')).toThrow(BadRequestException);
      expect(() => pipe.transform('54a91112345678')).toThrow(
        'El teléfono contiene caracteres inválidos: "a". Solo se permiten números y el símbolo "+".',
      );
    });

    it('should throw BadRequestException for too few digits', () => {
      expect(() => pipe.transform('123456789')).toThrow(BadRequestException);
      expect(() => pipe.transform('123456789')).toThrow(
        'El teléfono debe tener al menos 10 dígitos numéricos.',
      );
    });

    it('should throw BadRequestException for empty phone', () => {
      expect(() => pipe.transform('   ')).toThrow(BadRequestException);
      expect(() => pipe.transform('   ')).toThrow('El teléfono no puede estar vacío.');
    });
  });
});
