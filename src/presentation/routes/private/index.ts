import { Elysia } from 'elysia';
import { authPlugin } from '@/presentation/middlewares/auth/auth.plugin';
import type { AuthUser, JwtAuthPayload } from '@/shared/types/auth.types';
import { productRoutes } from './products.routes';
import { salesRoutes } from './sales.routes';
import { UserRole } from '@/domain/entities/user.entity';

export const privateRoutes = new Elysia({ prefix: '/api' })
  .use(authPlugin)

  // 🔐 AQUI É ONDE FUNCIONA
  .guard(
    {
      beforeHandle: async ({ request, jwt, set, store }) => {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
          set.status = 401;
          return 'Token não informado';
        }

        const token = authHeader.replace('Bearer ', '');
        const verified = await jwt.verify(token);

        if (!verified) {
          throw new Error('Token inválido');
        }

        const payload = verified as {
          sub: string;
          email: string;
          roles: UserRole[];
        };

        const user: AuthUser = {
          id: payload.sub as string,
          email: payload.email as string,
          roles: payload.roles as UserRole[]
        };

        store.user = user;
      }
    },
    (app) =>
      app
        // .decorate('user', null as AuthUser | null)
        .use(productRoutes)
        .use(salesRoutes)
  );
