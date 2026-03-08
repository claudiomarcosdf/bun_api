import { Elysia } from 'elysia';
import { applicationRoutes } from '@/presentation/routes';

export function registerRoutes(app: Elysia) {
  app
    .get(
      '/',
      () => ({
        message: 'Welcome to api_bun SaaS API',
        version: '1.0.0',
        docs: '/doc'
      }),
      {
        detail: {
          summary: 'Welcome endpoint',
          tags: ['General']
        }
      }
    )
    .use(applicationRoutes);

  return app;
}
