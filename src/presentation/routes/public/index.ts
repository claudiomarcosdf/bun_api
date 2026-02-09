import { Elysia } from 'elysia';
import { openedRoutes } from './public.routes';
import { healthRoutes } from './health.routes';
import { userRoutes } from './user.routes';

export const publicRoutes = new Elysia().use(healthRoutes).use(openedRoutes).use(userRoutes);
