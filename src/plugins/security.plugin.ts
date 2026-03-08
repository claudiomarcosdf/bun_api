import { Elysia } from 'elysia';
import { quotaPlugin } from './quota.plugin';
import { authPlugin } from './auth.plugin';

export const securityPlugin = new Elysia({ name: 'security-plugin' }).use(authPlugin).use(quotaPlugin);

export type SecurityPlugin = typeof securityPlugin;
