// auth.types.ts
import { UserRole } from '@/domain/entities/user.entity';

export interface AuthUser {
  id: string;
  email: string;
  roles: UserRole[];
}

export interface JwtAuthPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  iat: number;
  exp: number;
}
