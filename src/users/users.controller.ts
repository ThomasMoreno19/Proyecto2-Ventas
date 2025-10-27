import { Controller, Post, Body, Request, Get, Res } from '@nestjs/common';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { SendEmailOtpDto } from './dto/send-email-otp.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/create-auth.dto';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  register(@Request() req: ExpressRequest, @Body() dto: RegisterDto) {
    return this.usersService.register(req, dto);
  }

  @Get('session')
  getSession(@Session() session: UserSession) {
    return session;
  }

  @Post('signin')
  async signIn(
    @Request() req: ExpressRequest,
    @Body() dto: SignInDto,
    @Res() res: ExpressResponse,
  ) {
    const result = await this.usersService.login(req, dto);

    const cookie = result.headers.get('set-cookie');

    if (cookie) {
      res.setHeader('Set-Cookie', cookie);
    }

    res.cookie('better-auth.session_token', result.headers.get('set-cookie'), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res.json(result.response);
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
