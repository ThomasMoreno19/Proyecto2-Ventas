// src/ventas/helpers/validate-usuario.helper.spec.ts
import { validateUsuario } from './validate-usuario.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('validateUsuario', () => {
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;
  });

  it('should be defined', () => {
    expect(validateUsuario).toBeDefined();
  });

  
  it('should throw NotFoundException if usuario not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(validateUsuario(prisma, '999')).rejects.toThrow(NotFoundException);
    await expect(validateUsuario(prisma, '999')).rejects.toThrow(
      'Usuario con ID 999 no encontrado',
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '999' } });
  });
});