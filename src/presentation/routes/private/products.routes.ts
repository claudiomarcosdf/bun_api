import { Elysia } from 'elysia';
import { UserRole } from '@/domain/entities/user.entity';
import { authPlugin } from '@/presentation/middlewares/auth/auth.plugin';
import { getTenant } from '@/shared/utils/helper';

export const productRoutes = new Elysia().use(authPlugin).get(
  '/products',
  ({ user }) => {
    const tenantId = getTenant(user);

    return {
      message: 'Lista de produtos do tenant: ' + (tenantId || 'sem tenant'),
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
