import type { Context } from 'elysia';
import type { AuthUser } from '@/shared/types/auth.types';

export type AuthContext = Context & {
  store: {
    user: AuthUser | null;
  };
};
