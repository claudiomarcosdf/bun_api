import { createServer } from './application/server';
import { registerRoutes } from './application/routes';
import { bootstrap } from './application/bootstrap';
import { Logger } from './core/logger/logger';
import { env } from './core/config/env';

async function start() {
  await bootstrap();

  const app = createServer();

  registerRoutes(app);

  app.listen(env.PORT || 3000);

  Logger.info(`🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`);

  return app;
}

export const app = await start();

export type App = typeof app;
