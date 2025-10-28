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
      res.cookie("better-auth.session_token", token, {
        httpOnly: true,
        secure: isProduction,                 // HTTPS required in prod
        sameSite: isProduction ? "none" : "lax", // cross-site vs local dev
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        // ✅ only set domain when both are under same real domain
        ...(isProduction && env.PROD_FRONTEND_DOMAIN
          ? { domain: env.PROD_FRONTEND_DOMAIN }
          : {}),
      });
    }
  }

  return res.json(response.response);
}