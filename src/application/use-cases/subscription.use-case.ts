import { IUserRepository } from '@/domain/repositories/user.repository';
import { BadRequestError, NotFoundError } from '@/core/errors/api-error';
import { UserRole } from '@/domain/entities/user.entity';
import { Logger } from '@/core/logger/logger';
import { StripeService } from '@/infrastructure/external/stripe.service';
import { PaymentAccountModel } from '@/infrastructure/database/mongoose-schemas';
import { formatISOWithTimezone } from '@/shared/utils/helper';
import { ResolvedSubscription } from '@/shared/types/subscription.type';

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

  //Testar se é melhor usar o webhook do Stripe para confirmar o pagamento ou fazer essa confirmação via endpoint mesmo, chamando a API do Stripe para verificar o status da assinatura
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
      await updatePaymentAccount(subscriptionData);

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

  async webhookHandler(payload: any, sig: string) {
    if (!sig) {
      Logger.error('Missing Stripe signature in webhook request');
      throw new BadRequestError('Missing Stripe signature');
    }

    try {
      const subscription = await this.stripeService.webhookHandler(payload, sig);

      if (!subscription) {
        throw new BadRequestError('No session data received from webhook');
      }

      await updatePaymentAccount(subscription);

      Logger.info(`Payment confirmed via webhook for subscription: ${subscription.stripeSubscriptionId}`);

      return {
        plan: subscription.plan,
        status: subscription.stripeSubscriptionStatus,
        currentPeriodStart: formatISOWithTimezone(subscription.currentPeriodStart) // Convertendo de timestamp para Date
      };
    } catch (error: any) {
      Logger.error(`Error handling webhook event: ${error.message}`);
      throw new BadRequestError(`Failed to handle webhook event: ${error.message}`);
    }
  }
}

async function updatePaymentAccount(subscriptionData: ResolvedSubscription) {
  await PaymentAccountModel.findOneAndUpdate(
    { stripeCustomerId: subscriptionData.stripeCustomerId },
    {
      stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
      stripePriceId: subscriptionData.stripePriceId,
      unitAmount: subscriptionData.unitAmount,
      currentPeriodStart: subscriptionData.currentPeriodStart,
      stripeSubscriptionStatus: subscriptionData.stripeSubscriptionStatus,
      plan: subscriptionData.plan,
      updatedAt: formatISOWithTimezone(subscriptionData.currentPeriodStart); // Ajuste para o timezone de Brasília (UTC-3)
    },
    { new: true }
  );
}
