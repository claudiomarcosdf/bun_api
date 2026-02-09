import { authPlugin } from '@/presentation/middlewares/auth/auth.plugin';
import { Elysia } from 'elysia';

export const salesRoutes = new Elysia().use(authPlugin).get(
  '/sales',
  ({ user }) => {
    console.log('user', user);
    return { message: 'Lista de vendas' };
  },
  {
    requiredAuth: true,
    //requireRole: [UserRole.ADMIN],
    detail: {
      summary: 'Lista de Vendas',
      tags: ['Sales']
    }
  }
);
