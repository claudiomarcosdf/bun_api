import { Elysia } from 'elysia';
import { bearer } from '@elysiajs/bearer';
import { jwt } from '@elysiajs/jwt';
import { env } from '@/core/config/env';
import { UserRole } from '@/domain/entities/user.entity';
import { AuthUser } from '@/shared/types/auth.types';
import { ApiError, ForbiddenError, UnauthorizedError } from '@/core/errors/api-error';

export const authPlugin = new Elysia({ name: 'plugin' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET || 'secret',
      exp: '1d'
    })
  )
  .use(bearer())
  .macro({
    requiredAuth: (enabled: boolean) => ({
      resolve: async ({ bearer, jwt }) => {
        if (!enabled) return {};
        if (!bearer) {
          throw new UnauthorizedError('Missing authorization header');
        }

        const payload = await jwt.verify(bearer);
        if (!payload) {
          throw new UnauthorizedError('Invalid or expired token');
        }

        const user = {
          id: payload.sub,
          email: payload.email,
          roles: payload.roles
        } as AuthUser;

        return { user };
      }
    }),

    requireRole: (allowedRoles: UserRole[]) => ({
      resolve: async ({ bearer, jwt }) => {
        if (!bearer) {
          throw new UnauthorizedError('User not authenticated');
        }

        const payload = await jwt.verify(bearer);

        if (!payload) {
          throw new UnauthorizedError('Invalid or expired token');
        }

        const user = {
          id: payload.sub,
          email: payload.email,
          roles: payload.roles
        } as AuthUser;

        const allowed = user.roles.some((role) => allowedRoles.includes(role));

        if (!allowed) {
          throw new ForbiddenError('Insufficient permissions');
        }

        return { user };
      }
    })
  });
