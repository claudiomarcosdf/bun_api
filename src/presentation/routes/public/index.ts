import { Elysia } from 'elysia';
import { authRoutes } from './auth.routes';
import { healthRoutes } from './health.routes';
import { userRoutes } from './user.routes';

export const publicRoutes = new Elysia().use(healthRoutes).use(authRoutes).use(userRoutes);
