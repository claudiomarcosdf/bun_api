import { IUserRepository } from '@/domain/repositories/user.repository';
import { BadRequestError, NotFoundError } from '@/core/errors/api-error';
import { UserRole } from '@/domain/entities/user.entity';
import { Logger } from '@/core/logger/logger';
import { StripeService } from '@/infrastructure/external/stripe.service';
import { PaymentAccountModel } from '@/infrastructure/database/mongoose-schemas';
import { formatAmericanDateTimeUTC, formatISOWithTimezone } from '@/shared/utils/helper';

export class SubscriptionUseCase {
  private stripeService: StripeService;

  constructor(private userRepository: IUserRepository) {
    this.stripeService = new StripeService();
  }

  async checkout(userId: string) {
    const existingUser = await this.userRepository.getUserAndPaymentAccountById(userId);
    if (!existingUser || !existingUser.active) {
      throw new NotFoundError('User invalid or user not active');
    }

    const stripeCustomerId = existingUser.paymentAccountId?.stripeCustomerId;

    try {
      // 1. Realiza a assinatura no Stripe (a lógica de assinatura pode ser mais complexa dependendo do plano e opções)
      const sessionURL = await this.stripeService.updatePlanToPro(stripeCustomerId);

      Logger.info(`Session initialized to change plan PRO: ${sessionURL}`);

      return sessionURL;
    } catch (error: any) {
      Logger.error(`Error during session initialization: ${error.message}`);
      throw new BadRequestError(`Failed to initialize session: ${error.message}`);
    }
  }

  async confirmPayment(sessionId: string, userId: string) {
    try {
      //checa se a assinatura já está ativa para o usuário
      const existingUser = await this.userRepository.getUserAndPaymentAccountById(userId);
      if (!existingUser || !existingUser.paymentAccountId) {
        throw new NotFoundError('User or payment account not found');
      }

      if (existingUser.paymentAccountId.stripeSubscriptionStatus === 'active') {
        throw new BadRequestError('Subscription is already active');
      }

      // 1. Confirma o pagamento e obtém os dados da assinatura
      const subscriptionData = await this.stripeService.confirmPayment(sessionId);

      await PaymentAccountModel.findOneAndUpdate(
        { stripeCustomerId: subscriptionData.stripeCustomerId },
        {
          stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
          stripePriceId: subscriptionData.stripePriceId,
          unitAmount: subscriptionData.unitAmount,
          currentPeriodStart: subscriptionData.currentPeriodStart,
          stripeSubscriptionStatus: subscriptionData.stripeSubscriptionStatus,
          plan: subscriptionData.plan,
          updatedAt: subscriptionData.currentPeriodStart
        },
        { new: true }
      );

      Logger.info(`Subscription confirmed for session: ${sessionId}`);

      return {
        plan: subscriptionData.plan,
        status: subscriptionData.stripeSubscriptionStatus,
        currentPeriodStart: formatISOWithTimezone(subscriptionData.currentPeriodStart) // Convertendo de timestamp para Date
      };
    } catch (error: any) {
      Logger.error(`Error during payment confirmation: ${error.message}`);
      throw new BadRequestError(`Failed to confirm payment: ${error.message}`);
    }
  }
}
