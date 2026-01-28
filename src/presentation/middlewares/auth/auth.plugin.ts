import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '@/core/config/env';
import { AuthUser } from '@/shared/types/auth.types';

export const authPlugin = new Elysia().state('user', null as AuthUser | null).use(
  jwt({
    name: 'jwt',
    secret: env.JWT_SECRET || 'secret',
    exp: '1d'
  })
);
