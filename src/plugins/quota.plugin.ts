import { Elysia } from 'elysia';
import { ForbiddenError } from '@/core/errors/api-error';
import { quotaService } from '@/infrastructure/services/quota.service';
import { PlanResource } from '@/core/config/plan-limits';
import { authPlugin } from './auth.plugin';

export const quotaPlugin = new Elysia({
  name: 'quota-plugin'
})
  .use(authPlugin)
  .macro({
    enforceQuota: (resource: PlanResource) => ({
      resolve: async ({ user }) => {
        const allowed = await quotaService.checkLimit(user.id, resource);

        if (!allowed) {
          throw new ForbiddenError(`Quota exceeded for ${resource}. Upgrade your plan.`);
        }

        return {};
      }
    })
  });

export type QuotaPlugin = typeof quotaPlugin;
