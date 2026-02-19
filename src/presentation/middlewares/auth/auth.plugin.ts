import { Elysia } from 'elysia';
import { bearer } from '@elysiajs/bearer';
import { jwt } from '@elysiajs/jwt';
import { env } from '@/core/config/env';
import { UserRole } from '@/domain/entities/user.entity';
import { AuthUser } from '@/shared/types/auth.types';
import { ForbiddenError, UnauthorizedError } from '@/core/errors/api-error';

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
      resolve: async ({ bearer, jwt, cookie }) => {
        if (!enabled) return {};

        // Tenta cookie HttpOnly primeiro, depois bearer (mobile/Postman)
        const rawToken = cookie?.auth_token?.value ?? bearer;
        const token = typeof rawToken === 'string' && rawToken.length > 0 ? rawToken : null;

        if (!token) {
          throw new UnauthorizedError('Missing authorization header');
        }

        const payload = await jwt.verify(token);
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
      resolve: async ({ bearer, jwt, cookie }) => {
        const rawToken = cookie?.auth_token?.value ?? bearer;
        const token = typeof rawToken === 'string' && rawToken.length > 0 ? rawToken : null;

        if (!token) {
          throw new UnauthorizedError('User not authenticated');
        }

        const payload = await jwt.verify(token);

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
