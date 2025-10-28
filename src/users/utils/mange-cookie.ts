import { Response } from "express";

type SignInResponse = {
  headers: Headers;
  response: {
    redirect: boolean;
    token: string;
    url: string | undefined;
    user: {
      id: string;
      email: string;
      name: string;
      image: string | null | undefined;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

export function manageCookie(response: SignInResponse, res: Response) {
  const cookie = response.headers.get('set-cookie')
  const isProduction = process.env.NODE_ENV === 'production'

  if (cookie) {
    res.cookie('better-auth.session_token', cookie, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      domain: 'localhost',
    })
  }

  return res.json(response.response)
}