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
      // Extract domain from URL if needed (e.g., "https://example.com" -> "example.com")
      const getDomain = (url?: string) => {
        if (!url) return undefined;
        try {
          const urlObj = new URL(url);
          // Remove port if present and return just the hostname
          return urlObj.hostname;
        } catch {
          // If it's already a domain without protocol, return as-is
          return url;
        }
      };

      const cookieOptions: any = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      };

      // Only set domain if it's a real custom domain (not *.vercel.app)
      if (isProduction && env.PROD_FRONTEND_DOMAIN) {
        const extractedDomain = getDomain(env.PROD_FRONTEND_DOMAIN);
        // Vercel subdomains (*.vercel.app) can't use domain cookies
        if (extractedDomain && !extractedDomain.endsWith('.vercel.app')) {
          cookieOptions.domain = extractedDomain;
        }
      }

      res.cookie("better-auth.session_token", token, cookieOptions);
    }
  }

  return res.json(response.response);
}