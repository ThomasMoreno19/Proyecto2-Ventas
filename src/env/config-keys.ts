export const CONFIG_KEYS = {
  DATABASE_URL: 'DATABASE_URL',
  BETTER_AUTH_SECRET: 'BETTER_AUTH_SECRET',
  BETTER_AUTH_URL: 'BETTER_AUTH_URL',
  PROD_FRONTEND_DOMAIN: 'PROD_FRONTEND_DOMAIN',
  ORIGIN_URL: 'ORIGIN_URL',
} as const;

// Type for the keys
export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];

export const env: Env = {
  [CONFIG_KEYS.DATABASE_URL]: process.env.DATABASE_URL,
  [CONFIG_KEYS.BETTER_AUTH_SECRET]: process.env.BETTER_AUTH_SECRET,
  [CONFIG_KEYS.BETTER_AUTH_URL]: process.env.BETTER_AUTH_URL,
  [CONFIG_KEYS.PROD_FRONTEND_DOMAIN]: process.env.PROD_FRONTEND_DOMAIN,
  [CONFIG_KEYS.ORIGIN_URL]: process.env.ORIGIN_URL,
} as const;

export type Env = Record<ConfigKey, string | undefined>;