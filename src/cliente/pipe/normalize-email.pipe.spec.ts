// src/cliente/pipe/normalize-email.pipe.spec.ts
import { ValidateEmailPipe } from './normalize-email.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ValidateEmailPipe', () => {
  let pipe: ValidateEmailPipe;

  beforeEach(() => {
    pipe = new ValidateEmailPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should normalize a valid email', () => {
      const result = pipe.transform('  User@Example.COM  ');
      expect(result).toBe('user@example.com');
    });

    it('should throw BadRequestException for non-string input', () => {
      expect(() => pipe.transform(123 as any)).toThrow(BadRequestException);
      expect(() => pipe.transform(123 as any)).toThrow('El email debe ser un string.');
    });

    it('should throw BadRequestException for empty email', () => {
      expect(() => pipe.transform('   ')).toThrow(BadRequestException);
      expect(() => pipe.transform('   ')).toThrow('El email no puede estar vacío.');
    });

    it('should throw BadRequestException for too long email', () => {
      const longLocal = 'a'.repeat(65) + '@example.com';
      expect(() => pipe.transform(longLocal)).toThrow(BadRequestException);
      expect(() => pipe.transform(longLocal)).toThrow(
        'La parte local del email (antes de @) es demasiado larga.',
      );
    });

    it('should throw BadRequestException for invalid local part', () => {
      expect(() => pipe.transform('user@exam#ple.com')).toThrow(BadRequestException);
      expect(() => pipe.transform('user@exam#ple.com')).toThrow(
        'La parte local del email contiene caracteres inválidos.',
      );
    });

    it('should throw BadRequestException for invalid domain', () => {
      expect(() => pipe.transform('user@exam_ple')).toThrow(BadRequestException);
      expect(() => pipe.transform('user@exam_ple')).toThrow(
        'El dominio del email no es válido. Debe contener al menos un punto y solo caracteres válidos.',
      );
    });

    it('should throw BadRequestException for missing @', () => {
      expect(() => pipe.transform('userexample')).toThrow(BadRequestException);
      expect(() => pipe.transform('userexample')).toThrow(
        'El email debe contener un solo "@" y partes local y dominio válidas.',
      );
    });
  });
});
