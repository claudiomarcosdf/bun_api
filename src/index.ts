import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import mongoose from 'mongoose';
import { errorMiddleware } from './presentation/middlewares/error.middleware';
import { Logger } from './core/logger/logger';
import { env } from './core/config/env';
import { publicRoutes } from './presentation/routes/public';
import { privateRoutes } from './presentation/routes/private';
import { authPlugin } from './presentation/middlewares/auth/auth.plugin';

const app = new Elysia()
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
  )
  .use(errorMiddleware)
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
  .use(publicRoutes)
  .use(privateRoutes)
  .listen(env.PORT || 3000);

// Database Connection
mongoose
  .connect(env.DATABASE_URL || 'mongodb://localhost:27017/api_bun')
  .then(() => Logger.info('Connected to MongoDB'))
  .catch((err) => Logger.error('MongoDB connection error', err));

Logger.info(`🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
