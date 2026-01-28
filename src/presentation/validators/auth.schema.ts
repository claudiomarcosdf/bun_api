import { z } from 'zod';
import { UserRole } from '@/domain/entities/user.entity';

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export const jwtPayloadSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  active: z.boolean(),
  roles: z.array(z.nativeEnum(UserRole)),
  tenantId: z.string().optional(),

  iat: z.number().optional(),
  exp: z.number().optional()
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
