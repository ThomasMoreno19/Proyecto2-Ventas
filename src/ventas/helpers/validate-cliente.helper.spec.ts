// src/ventas/helpers/validate-cliente.helper.spec.ts
import { validateCliente } from './validate-cliente.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Cliente } from '@prisma/client';

describe('validateCliente', () => {
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      cliente: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;
  });

  it('should be defined', () => {
    expect(validateCliente).toBeDefined();
  });

  it('should return cliente if found', async () => {
    const mockCliente: Cliente = {
      cuil: '12345678',
      nombre: 'Cliente 1',
      apellido: 'Test',
      telefono: '123456789',
      email: 'cliente@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    (prisma.cliente.findUnique as jest.Mock).mockResolvedValue(mockCliente);

    const result = await validateCliente(prisma, '12345678');
    expect(result).toEqual(mockCliente);
    expect(prisma.cliente.findUnique).toHaveBeenCalledWith({
      where: { cuil: '12345678', deletedAt: null },
    });
  });

  it('should throw NotFoundException if cliente not found', async () => {
    (prisma.cliente.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(validateCliente(prisma, '99999999')).rejects.toThrow(NotFoundException);
    await expect(validateCliente(prisma, '99999999')).rejects.toThrow(
      'Cliente con CUIL 99999999 no encontrado',
    );
    expect(prisma.cliente.findUnique).toHaveBeenCalledWith({
      where: { cuil: '99999999', deletedAt: null },
    });
  });
});