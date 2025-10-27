import { Controller, Post, Body, Request, Res } from '@nestjs/common';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { SendEmailOtpDto } from './dto/send-email-otp.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/create-auth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Request() req: ExpressRequest, @Body() dto: RegisterDto) {
    return this.usersService.register(req, dto);
  }

  @Post('signin')
  async signIn(
    @Request() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Body() dto: SignInDto,
  ) {
    const result = await this.usersService.login(req, dto);

    // Better Auth API methods return a token in the response body
    // We need to manually set it as a cookie
    const { token, ...userData } = result as any;

    // Set the token as an HTTP-only cookie
    if (token) {
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('better-auth.session_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return res.status(201).json(userData || result);
  }

  @Post('email-exists')
  emailExists(@Body() dto: CheckEmailDto) {
    return this.usersService.emailExists(dto);
  }

  @Post('email/otp')
  sendEmailOtp(@Request() req: ExpressRequest, @Body() dto: SendEmailOtpDto) {
    return this.usersService.sendEmailOtp(req, dto);
  }

  @Post('email/verify')
  verifyEmail(@Request() req: ExpressRequest, @Body() dto: VerifyEmailOtpDto) {
    return this.usersService.verifyEmail(req, dto);
  }

  @Post('password/reset/request')
  requestPasswordReset(@Request() req: ExpressRequest, @Body() dto: CheckEmailDto) {
    return this.usersService.requestPasswordReset(req, dto);
  }

  @Post('password/reset/confirm')
  confirmPasswordReset(@Request() req: ExpressRequest, @Body() dto: ResetPasswordDto) {
    return this.usersService.confirmPasswordReset(req, dto);
  }
}
