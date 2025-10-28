import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { bearer } from 'better-auth/plugins';
import prisma from './db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
    },
  },
  plugins: [
    bearer(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // For this project we just log the OTP
        console.log('Email OTP', { email, otp, type });
        await Promise.resolve();
      },
    }),
  ],
});
