import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(10),
  BETTER_AUTH_SECRET: z.string().min(10), //Não estou usando login social
  BETTER_AUTH_EXPIRATION: z.string().min(1),
  STRIPE_PUBLIC_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().min(1),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM: z.string().min(1),
  APP_URL: z.string().min(1)
});

export const env = envSchema.parse(Bun.env);
