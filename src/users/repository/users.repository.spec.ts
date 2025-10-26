// src/users/repository/users.repository.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUsersRepository } from './users.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

const MockAuthGuard = {
  canActivate: jest.fn(() => true),
};
// Mock de PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('PrismaUsersRepository', () => {
  let repository: PrismaUsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUsersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    repository = module.get<PrismaUsersRepository>(PrismaUsersRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        emailVerified: false,
        role: 'USER',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        emailVerified: false,
        role: 'USER',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.getById('1');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.getById('nonexistent');
      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  describe('updateEmailVerified', () => {
    it('should update emailVerified and return the updated user', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        emailVerified: true,
        role: 'USER',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await repository.updateEmailVerified('1', true);
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { emailVerified: true },
      });
    });
  });
});
