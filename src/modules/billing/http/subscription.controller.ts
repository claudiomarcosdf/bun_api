import { SubscriptionUseCase } from '@/modules/billing/application/subscription.use-case';
import { MongooseUserRepository } from '@/modules/auth/infrastructure/mongoose-user.repository';

export class SubscriptionController {
  private userRepository: MongooseUserRepository;
  private subscriptionUseCase: SubscriptionUseCase;

  constructor() {
    this.userRepository = new MongooseUserRepository();
    this.subscriptionUseCase = new SubscriptionUseCase(this.userRepository);
  }

  async subscriptionCheckout(userId: string) {
    return await this.subscriptionUseCase.checkout(userId);
  }

  async subscriptionConfirm(sessionId: string, userId: string) {
    return await this.subscriptionUseCase.confirmPayment(sessionId, userId);
  }

  async subscriptionWebhook(payload: Buffer<ArrayBuffer>, sig: string) {
    return await this.subscriptionUseCase.webhookHandler(payload, sig);
  }

  async cancelSubscription(userId: string) {
    return await this.subscriptionUseCase.cancelSubscription(userId);
  }
}
