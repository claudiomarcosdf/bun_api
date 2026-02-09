import { Elysia } from 'elysia';
import { productRoutes } from './products.routes';
import { salesRoutes } from './sales.routes';

export const privateRoutes = new Elysia({ prefix: '/api' }).use(productRoutes).use(salesRoutes);
