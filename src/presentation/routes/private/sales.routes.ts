import { authPlugin } from '@/presentation/middlewares/auth/auth.plugin';
import { Elysia } from 'elysia';

export const salesRoutes = new Elysia().use(authPlugin).get('/sales', ({ store }) => {
  console.log('user', store.user);
  return { message: 'Lista de vendas' };
});
