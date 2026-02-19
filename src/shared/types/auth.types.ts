// auth.types.ts
import { UserRole } from '@/domain/entities/user.entity';

export interface AuthUser {
  id: string;
  email: string;
  roles: UserRole[];
  iat: number;
  exp: number;
}

export interface JwtAuthPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  iat: number;
  exp: number;
}

export interface CookieType {
  auth_token: {
    set: (options: {
      value: string;
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
      maxAge: number;
      path: string;
    }) => void;
  };
}
