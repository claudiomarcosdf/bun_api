import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { errorMiddleware } from '../presentation/middlewares/error.middleware';

export function createServer() {
  const app = new Elysia();

  errorMiddleware(app);

  app
    .use(
      cors({
        origin: '*',
        credentials: true
      })
    )
    .use(
      swagger({
        path: '/doc',
        documentation: {
          info: {
            title: 'api_bun SaaS API',
            version: '1.0.0',
            description: 'Multi-tenant SaaS API Boilerplate'
          }
        }
      })
    );

  return app;
}
