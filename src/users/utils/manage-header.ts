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

export function manageHeader(response: SignInResponse, res: Response) {
  const bearerHeader = response.headers.get("set-auth-token");
  if (bearerHeader) {
    res.setHeader("set-auth-token", bearerHeader);
  }

  return res.json(response.response);
}