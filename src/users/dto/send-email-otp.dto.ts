import { Transform } from 'class-transformer';
import { IsEmail, IsIn } from 'class-validator';

export type EmailOtpType = 'email-verification' | 'forget-password';

export class SendEmailOtpDto {
  @IsEmail()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email!: string;

  @IsIn(['email-verification', 'forget-password'])
  type!: EmailOtpType;
}


