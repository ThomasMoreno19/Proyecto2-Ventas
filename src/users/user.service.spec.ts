// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService, AuthGuard } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request as ExpressRequest } from 'express';
import { RegisterDto } from './dto/register.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { SendEmailOtpDto } from './dto/send-email-otp.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';

// Mock de AuthGuard
const MockAuthGuard = {
  canActivate: jest.fn(() => true),
};
// Mock de AuthService
const mockAuthService = {
  api: {
    signUpEmail: jest.fn(),
    signInEmail: jest.fn(),
    sendVerificationOTP: jest.fn(),
    verifyEmailOTP: jest.fn(),
    forgetPasswordEmailOTP: jest.fn(),
    resetPasswordEmailOTP: jest.fn(),
  },
};

// Mock de UsersRepository
const mockUsersRepository = {
  findByEmail: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: 'UsersRepository',
          useValue: mockUsersRepository,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should call signUpEmail with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: RegisterDto = { email: 'test@example.com', password: 'password', name: 'Test' };
      const mockResponse = { user: { id: '1' }, token: 'token' };
      mockAuthService.api.signUpEmail.mockResolvedValue(mockResponse);

      const result = await service.register(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.api.signUpEmail).toHaveBeenCalledWith({
        body: { email: 'test@example.com', password: 'password', name: 'Test' },
        headers: fromNodeHeaders({}),
      });
    });
  });

  describe('login', () => {
    it('should call signInEmail with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const mockResponse = { user: { id: '1' }, token: 'token' };
      mockAuthService.api.signInEmail.mockResolvedValue(mockResponse);

      const result = await service.login(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.api.signInEmail).toHaveBeenCalledWith({
        body: { email: 'test@example.com', password: 'password' },
        headers: fromNodeHeaders({}),
      });
    });
  });

  describe('emailExists', () => {
    it('should return exists based on repository result', async () => {
      const dto: CheckEmailDto = { email: 'test@example.com' };
      mockUsersRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        emailVerified: false,
        role: 'USER',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        sessions: [],
        accounts: [],
        ventas: [],
      });

      const result = await service.emailExists(dto);
      expect(result).toEqual({ exists: true });
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return false if user not found', async () => {
      const dto: CheckEmailDto = { email: 'nonexistent@example.com' };
      mockUsersRepository.findByEmail.mockResolvedValue(null);

      const result = await service.emailExists(dto);
      expect(result).toEqual({ exists: false });
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });
  });

  describe('sendEmailOtp', () => {
    it('should call sendVerificationOTP with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: SendEmailOtpDto = { email: 'test@example.com', type: 'email-verification' };
      const mockResponse = { success: true };
      mockAuthService.api.sendVerificationOTP.mockResolvedValue(mockResponse);

      const result = await service.sendEmailOtp(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.api.sendVerificationOTP).toHaveBeenCalledWith({
        body: { email: 'test@example.com', type: 'email' },
        headers: fromNodeHeaders({}),
      });
    });
  });

  describe('verifyEmail', () => {
    it('should call verifyEmailOTP with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: VerifyEmailOtpDto = { email: 'test@example.com', otp: '123456' };
      const mockResponse = { success: true };
      mockAuthService.api.verifyEmailOTP.mockResolvedValue(mockResponse);

      const result = await service.verifyEmail(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.api.verifyEmailOTP).toHaveBeenCalledWith({
        body: { email: 'test@example.com', otp: '123456' },
        headers: fromNodeHeaders({}),
      });
    });
  });

  describe('requestPasswordReset', () => {
    it('should call forgetPasswordEmailOTP with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: CheckEmailDto = { email: 'test@example.com' };
      const mockResponse = { success: true };
      mockAuthService.api.forgetPasswordEmailOTP.mockResolvedValue(mockResponse);

      const result = await service.requestPasswordReset(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.api.forgetPasswordEmailOTP).toHaveBeenCalledWith({
        body: { email: 'test@example.com' },
        headers: fromNodeHeaders({}),
      });
    });
  });

  describe('confirmPasswordReset', () => {
    it('should call resetPasswordEmailOTP with correct data', async () => {
      const req = { headers: {} } as ExpressRequest;
      const dto: ResetPasswordDto = {
        email: 'test@example.com',
        otp: '123456',
        password: 'newpassword',
      };
      const mockResponse = { success: true };
      mockAuthService.api.resetPasswordEmailOTP.mockResolvedValue(mockResponse);

      const result = await service.confirmPasswordReset(req, dto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.api.resetPasswordEmailOTP).toHaveBeenCalledWith({
        body: { email: 'test@example.com', otp: '123456', password: 'newpassword' },
        headers: fromNodeHeaders({}),
      });
    });
  });
});
