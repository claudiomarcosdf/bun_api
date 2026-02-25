import { Elysia } from 'elysia';
import { productRoutes } from './products.routes';
import { salesRoutes } from './sales.routes';
import { subscriptionRoutes } from './subscription';

export const privateRoutes = new Elysia({ prefix: '/api' }).use(productRoutes).use(salesRoutes).use(subscriptionRoutes);
