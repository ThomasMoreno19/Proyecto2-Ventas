import { Inject, Injectable } from '@nestjs/common';
import type { AuthService as AuthServiceType } from '@thallesp/nestjs-better-auth';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request as ExpressRequest } from 'express';
import { auth } from '../lib/auth';
import { RegisterDto } from './dto/register.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { SendEmailOtpDto } from './dto/send-email-otp.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { UsersRepository } from './repository/users.interface.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthServiceType<typeof auth>,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async register(req: ExpressRequest, dto: RegisterDto) {
    return this.authService.api.signUpEmail({
      body: {
        email: dto.email,
        password: dto.password,
        name: dto.name,
      },
      headers: fromNodeHeaders(req.headers),
    });
  }

  async login(req: ExpressRequest, dto: LoginDto) {
    return this.authService.api.signInEmail({
      body: {
        email: dto.email,
        password: dto.password,
      },
      headers: fromNodeHeaders(req.headers),
    });
  }

  async emailExists(dto: CheckEmailDto) {
    const existing = await this.usersRepository.findByEmail(dto.email);
    return { exists: !!existing };
  }

  async sendEmailOtp(req: ExpressRequest, dto: SendEmailOtpDto) {
    return this.authService.api.sendVerificationOTP({
      body: {
        email: dto.email,
        type: dto.type,
      },
      headers: fromNodeHeaders(req.headers),
    });
  }

  async verifyEmail(req: ExpressRequest, dto: VerifyEmailOtpDto) {
    return this.authService.api.verifyEmailOTP({
      body: {
        email: dto.email,
        otp: dto.otp,
      },
      headers: fromNodeHeaders(req.headers),
    });
  }

  async requestPasswordReset(req: ExpressRequest, dto: CheckEmailDto) {
    return this.authService.api.forgetPasswordEmailOTP({
      body: { email: dto.email },
      headers: fromNodeHeaders(req.headers),
    });
  }

  async confirmPasswordReset(req: ExpressRequest, dto: ResetPasswordDto) {
    return this.authService.api.resetPasswordEmailOTP({
      body: {
        email: dto.email,
        otp: dto.otp,
        password: dto.password,
      },
      headers: fromNodeHeaders(req.headers),
    });
  }
}
