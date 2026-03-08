import { securityPlugin } from '@/plugins/security.plugin';
import { Elysia } from 'elysia';

// Usuários do Tenant
export const userRoutes = new Elysia({ prefix: '/users' }).use(securityPlugin).post('/teste', (context) => {}, {
  // body: RegisterUserDTO,
  // detail: {
  //   summary: 'Register a new user',
  //   tags: ['User']
  // }
});
