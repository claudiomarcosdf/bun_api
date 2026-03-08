import { Elysia } from 'elysia';
import { UserRole } from '@/modules/auth/domain/user.entity';
import { getTenant } from '@/shared/utils/helper';
import { securityPlugin } from '@/plugins/security.plugin';

export const productRoutes = new Elysia().use(securityPlugin).get(
  '/products',
  ({ user }) => {
    const tenantId = getTenant(user);

    // await ProductModel.create(product);

    // await TenantUsageModel.updateOne(
    //   { tenantId },
    //   { $inc: { "usage.products": 1 } },
    //   { upsert: true }
    // );

    return {
      message: 'Lista de produtos do tenant: ' + (tenantId || 'sem tenant'),
      user
    };
  },
  {
    requiredAuth: true,
    requireRole: [UserRole.ADMIN],
    detail: {
      summary: 'Lista de produtos',
      tags: ['Products']
    }
  }
);
