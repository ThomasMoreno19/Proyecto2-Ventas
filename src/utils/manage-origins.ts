import { env } from "src/env/config-keys";

export function manageOrigins(origin: string | undefined, callback: (err: Error | null, result: boolean) => void) {
  const allowedOrigins = env.ORIGINS
    ? env.ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:5173'];

  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'), false);
  }
}