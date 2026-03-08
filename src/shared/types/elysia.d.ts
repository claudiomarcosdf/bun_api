import 'elysia';
import { AuthUser } from '@/modules/auth/domain/auth.types';
import { PlanResource } from '@/core/config/plan-limits';
import { UserRole } from '@/modules/auth/domain/user.entity';

declare module 'elysia' {
  interface Context {
    user: AuthUser;
  }
}

declare global {
  namespace ElysiaApp {
    interface LocalHook {
      requiredAuth?: boolean;
      requireRole?: UserRole[];
      enforceQuota?: PlanResource;
    }
  }
}
