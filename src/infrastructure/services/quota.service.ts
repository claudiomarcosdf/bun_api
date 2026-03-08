import { PLAN_LIMITS, PlanType, PlanResource } from '@/core/config/plan-limits';
import { UserModel, TenantUsageModel } from '@/infrastructure/database/schemas';
import { IPaymentAccount } from '@/modules/billing/domain/payment-account.entity';

class QuotaService {
  async checkLimit(tenantId: string, resource: PlanResource) {
    const user = await UserModel.findOne({ _id: tenantId }).populate('paymentAccountId');
    const paymentAccount = user?.paymentAccountId as IPaymentAccount | null;

    const rawPlan = paymentAccount?.plan ?? 'FREE';

    const plan: PlanType = rawPlan in PLAN_LIMITS ? (rawPlan as PlanType) : 'FREE';

    const limits = PLAN_LIMITS[plan];

    const limit = limits[resource];

    if (limit === -1) {
      return true;
    }

    const usage = await TenantUsageModel.findOne({ tenantId });

    console.log('usage', usage?.usage?.[resource]);

    const used = usage?.usage?.[resource] ?? 0;

    if (used >= limit) {
      return false;
    }

    return true;
  }
}

export const quotaService = new QuotaService();
