import { Controller, Post, Body, Request, Req, Res } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { SendEmailOtpDto } from './dto/send-email-otp.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import * as express from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Request() req: ExpressRequest, @Body() dto: RegisterDto) {
    return this.usersService.register(req, dto);
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

  @Post('signin')
  async login(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body() dto: LoginDto,
  ) {
    const { token, user } = await this.usersService.login(req, dto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,       // true si HTTPS
      sameSite: 'lax',     // 'none' si cross-site y HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user };
  }
}

