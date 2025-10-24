export const CONFIG_KEYS = {
  DATABASE_URL: 'DATABASE_URL',
  BETTER_AUTH_SECRET: 'BETTER_AUTH_SECRET',
  BETTER_AUTH_URL: 'BETTER_AUTH_URL',
} as const;

// Type for the keys
export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];
