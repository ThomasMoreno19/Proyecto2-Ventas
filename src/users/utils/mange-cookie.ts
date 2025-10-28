import { Response } from "express";
import { env } from "src/env/config-keys";

type SignInResponse = {
  headers: Headers;
  response: {
    redirect: boolean;
    token: string;
    url?: string;
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
};

export function manageCookie(response: SignInResponse, res: Response) {
  const rawCookie = response.headers.get("set-cookie");
  const isProduction = process.env.NODE_ENV === "production";

  if (rawCookie) {
    const match = rawCookie.match(/better-auth\.session_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;

    if (token) {
      const cookieOptions: any = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        // For modern browsers with third-party cookie restrictions (CHIPS)
        partitioned: isProduction,
      };

      res.cookie("better-auth.session_token", token, cookieOptions);
    }
  }

  return res.json(response.response);
}