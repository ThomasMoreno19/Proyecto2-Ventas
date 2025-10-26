import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUsersRepository } from './users.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

// Mock de PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

// Función para generar un usuario mock con fechas estables.
// Esto evita que las aserciones `toEqual` fallen debido a diferencias de milisegundos.
const generateMockUser = (id: string, email: string, emailVerified: boolean): User => ({
  id,
  email,
  name: 'Test',
  emailVerified: emailVerified,
  role: 'USER',
  image: null,
  // Fecha fija para estabilidad en los tests
  createdAt: new Date('2025-10-26T04:41:54.928Z'),
  updatedAt: new Date('2025-10-26T04:41:54.928Z'),
});

describe('PrismaUsersRepository', () => {
  let repository: PrismaUsersRepository;

  beforeEach(async () => {
    // 1. Limpiamos el historial de llamadas y reiniciamos las implementaciones de mock
    mockPrismaService.user.findUnique.mockClear();
    mockPrismaService.user.update.mockClear();

    // 2. Establecemos una resolución por defecto para evitar fallos por mocks faltantes
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.update.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUsersRepository,
        {
          // Proporcionamos el mock para la inyección de PrismaService
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaUsersRepository>(PrismaUsersRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      // Configuramos el mock localmente
      const mockUser = generateMockUser('1', 'test@example.com', false);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return null if user not found', async () => {
      // Configuramos el mock localmente (ya está en null por el beforeEach, pero se explicita)
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      // Configuramos el mock localmente
      const mockUser = generateMockUser('1', 'test@example.com', false);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.getById('1');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return null if user not found', async () => {
      // Configuramos el mock localmente
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.getById('nonexistent');

      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateEmailVerified', () => {
    it('should update emailVerified and return the updated user', async () => {
      // Configuramos el mock localmente
      const mockUser = generateMockUser('1', 'test@example.com', true);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await repository.updateEmailVerified('1', true);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { emailVerified: true },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1);
    });
  });
});
