import { StripeProvider } from './providers/stripe.provider';
import { Logger } from '@/core/logger/logger';
import { ResolvedSubscription } from '@/modules/billing/domain/subscription.type';

export class PaymentService {
  private provider: StripeProvider;

  constructor() {
    // futuramente pode trocar provider aqui
    this.provider = new StripeProvider();
  }

  async createDefaultAccount(email: string, name: string) {
    try {
      return await this.provider.generateDefaultPaymentAccount(email, name);
    } catch (error: any) {
      Logger.error(`PaymentService (createDefaultAccount): ${error.message}`);
      throw error;
    }
  }

  async updatePlanToPro(stripeCustomerId: string, userId: string) {
    try {
      return await this.provider.updatePlanToPro(stripeCustomerId, userId);
    } catch (error: any) {
      Logger.error(`PaymentService (updatePlanToPro): ${error.message}`);
      throw error;
    }
  }

  async confirmPayment(sessionId: string): Promise<ResolvedSubscription> {
    try {
      return await this.provider.confirmPayment(sessionId);
    } catch (error: any) {
      Logger.error(`PaymentService (confirmPayment): ${error.message}`);
      throw error;
    }
  }

  async cancelSubscription(stripeSubscriptionId: string) {
    try {
      return await this.provider.cancelSubscription(stripeSubscriptionId);
    } catch (error: any) {
      Logger.error(`PaymentService (cancelSubscription): ${error.message}`);
      throw error;
    }
  }

  async activePlan(stripeSubscriptionId: string, dbSubscriptionStatus: string) {
    try {
      return await this.provider.activePlan(stripeSubscriptionId, dbSubscriptionStatus);
    } catch (error: any) {
      Logger.error(`PaymentService (activePlan): ${error.message}`);
      throw error;
    }
  }

  async handleWebhook(payload: Buffer<ArrayBuffer>, signature: string) {
    try {
      return await this.provider.webhookHandler(payload, signature);
    } catch (error: any) {
      Logger.error(`PaymentService (handleWebhook): ${error.message}`);
      throw error;
    }
  }
}
