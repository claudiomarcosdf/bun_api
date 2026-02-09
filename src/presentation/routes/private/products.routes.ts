import { Elysia } from 'elysia';
import { UserRole } from '@/domain/entities/user.entity';
import { authPlugin } from '@/presentation/middlewares/auth/auth.plugin';

export const productRoutes = new Elysia().use(authPlugin).get(
  '/products',
  ({ user }) => {
    return {
      message: 'Lista de produtos',
      user
    };
  },
  {
    requiredAuth: true,
    requireRole: [UserRole.ADMIN],
    detail: {
      summary: 'Lista de produtos',
      tags: ['Products']
    }
  }
);
