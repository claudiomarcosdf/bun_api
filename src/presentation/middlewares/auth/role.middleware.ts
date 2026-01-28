import { UserRole } from '@/domain/entities/user.entity';
import type { AuthContext } from './auth.context';

export const requireRole =
  (allowedRoles: UserRole[]) =>
  ({ store, set }: AuthContext) => {
    const user = store.user;

    if (!user) {
      set.status = 401;
      throw new Error('Não autenticado');
    }

    const allowed = user.roles.some((role) => allowedRoles.includes(role));

    if (!allowed) {
      set.status = 403;
      throw new Error('Acesso negado');
    }
  };
