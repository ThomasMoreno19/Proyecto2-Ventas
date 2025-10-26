// src/users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '@thallesp/nestjs-better-auth'; // Ajusta la importación
import type { Request as ExpressRequest } from 'express';
import { RegisterDto } from './dto/register.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { SendEmailOtpDto } from './dto/send-email-otp.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';

// Mock de UsersService
const mockUsersService = {
  register: jest.fn(),
  emailExists: jest.fn(),
  sendEmailOtp: jest.fn(),
  verifyEmail: jest.fn(),
  requestPasswordReset: jest.fn(),
  confirmPasswordReset: jest.fn(),
  login: jest.fn(),
};

// Mock de AuthGuard
const MockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call register service with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: RegisterDto = { email: 'test@example.com', password: 'password', name: 'Test' };
      const mockResponse = { user: { id: '1' }, token: 'token' };
      mockUsersService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockUsersService.register).toHaveBeenCalledWith(req, dto);
    });
  });

  describe('emailExists', () => {
    it('should call emailExists service with correct data', async () => {
      const dto: CheckEmailDto = { email: 'test@example.com' };
      const mockResponse = { exists: true };
      mockUsersService.emailExists.mockResolvedValue(mockResponse);

      const result = await controller.emailExists(dto);
      expect(result).toEqual(mockResponse);
      expect(mockUsersService.emailExists).toHaveBeenCalledWith(dto);
    });
  });

  describe('sendEmailOtp', () => {
    it('should call sendEmailOtp service with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: SendEmailOtpDto = { email: 'test@example.com', type: 'email-verification' };
      const mockResponse = { success: true };
      mockUsersService.sendEmailOtp.mockResolvedValue(mockResponse);

      const result = await controller.sendEmailOtp(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockUsersService.sendEmailOtp).toHaveBeenCalledWith(req, dto);
    });
  });

  describe('verifyEmail', () => {
    it('should call verifyEmail service with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: VerifyEmailOtpDto = { email: 'test@example.com', otp: '123456' };
      const mockResponse = { success: true };
      mockUsersService.verifyEmail.mockResolvedValue(mockResponse);

      const result = await controller.verifyEmail(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockUsersService.verifyEmail).toHaveBeenCalledWith(req, dto);
    });
  });

  describe('requestPasswordReset', () => {
    it('should call requestPasswordReset service with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: CheckEmailDto = { email: 'test@example.com' };
      const mockResponse = { success: true };
      mockUsersService.requestPasswordReset.mockResolvedValue(mockResponse);

      const result = await controller.requestPasswordReset(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockUsersService.requestPasswordReset).toHaveBeenCalledWith(req, dto);
    });
  });

  describe('confirmPasswordReset', () => {
    it('should call confirmPasswordReset service with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: ResetPasswordDto = {
        email: 'test@example.com',
        otp: '123456',
        password: 'newpassword',
      };
      const mockResponse = { success: true };
      mockUsersService.confirmPasswordReset.mockResolvedValue(mockResponse);

      const result = await controller.confirmPasswordReset(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockUsersService.confirmPasswordReset).toHaveBeenCalledWith(req, dto);
    });
  });

  describe('login', () => {
    it('should call login service with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const mockResponse = { user: { id: '1' }, token: 'token' };
      mockUsersService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockUsersService.login).toHaveBeenCalledWith(req, dto);
    });
  });
});
