import { env } from './env';

export const PLAN_LIMITS = {
  FREE: {
    products: env.FREE_PRODUCTS_LIMIT ?? 20,
    sales: env.FREE_SALES_LIMIT ?? 50
  },

  PRO: {
    products: env.PRO_PRODUCTS_LIMIT ?? -1, //ILIMITADO
    sales: env.PRO_SALES_LIMIT ?? -1
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;
export type PlanResource = keyof typeof PLAN_LIMITS.FREE;
