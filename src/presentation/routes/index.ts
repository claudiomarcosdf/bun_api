import { Elysia } from 'elysia';
import { authRoutes } from './auth.routes';
import { healthRoutes } from './health.routes';
import { protectedRoutes } from './protected';

export const applicationRoutes = (app: Elysia) => {
  app.use(authRoutes).use(healthRoutes).use(protectedRoutes);

  return app;
};
