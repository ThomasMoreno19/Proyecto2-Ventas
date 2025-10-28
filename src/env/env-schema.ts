import Joi from 'joi';

export const envSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  BETTER_AUTH_SECRET: Joi.string().required(),
  BETTER_AUTH_URL: Joi.string().uri().required(),
  PROD_FRONTEND_DOMAIN: Joi.string().uri().optional(),
});
