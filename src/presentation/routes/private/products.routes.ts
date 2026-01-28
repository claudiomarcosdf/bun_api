import { Elysia } from 'elysia';
import { requireRole } from '@/presentation/middlewares/auth/role.middleware';
import { UserRole } from '@/domain/entities/user.entity';
import { authPlugin } from '@/presentation/middlewares/auth/auth.plugin';

export const productRoutes = new Elysia()
  .use(authPlugin)
  .onBeforeHandle(requireRole([UserRole.ADMIN]))
  .get('/products', ({ store: { user } }) => {
    console.log('user in product', user);

    return {
      message: 'Lista de produtos',
      user
    };
  });
