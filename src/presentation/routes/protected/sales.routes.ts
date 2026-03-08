import { securityPlugin } from '@/plugins/security.plugin';
import { Elysia } from 'elysia';

export const salesRoutes = new Elysia().use(securityPlugin).get(
  '/sales',
  ({ user }) => {
    console.log('user', user);
    return { message: 'Lista de vendas' };
  },
  {
    requiredAuth: true,
    enforceQuota: 'sales',
    //requireRole: [UserRole.ADMIN],
    detail: {
      summary: 'Lista de Vendas',
      tags: ['Sales']
    }
  }
);
