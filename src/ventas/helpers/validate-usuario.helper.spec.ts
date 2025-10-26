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

  it('should return usuario if found', async () => {
    const mockUsuario: User = {
      id: '1',
      email: 'user@example.com',
      name: 'User 1',
      emailVerified: true,
      role: 'USER',
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      sessions: [],
      accounts: [],
      ventas: [],
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUsuario);

    const result = await validateUsuario(prisma, '1');
    expect(result).toEqual(mockUsuario);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should throw NotFoundException if usuario not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(validateUsuario(prisma, '999')).rejects.toThrow(NotFoundException);
    await expect(validateUsuario(prisma, '999')).rejects.toThrow('Usuario con ID 999 no encontrado');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '999' } });
  });
});
