import { IUserRepository } from '@/modules/auth/infrastructure/interface/user.repository';
import { BadRequestError, NotFoundError } from '@/core/errors/api-error';
import { UserRole } from '@/modules/auth/domain/user.entity';
import { Logger } from '@/core/logger/logger';
import { PaymentService } from '@/infrastructure/payments/payment.service';
import { PaymentAccountModel } from '@/infrastructure/database/schemas';
import { formatISOWithTimezone } from '@/shared/utils/helper';
import { ResolvedSubscription } from '@/modules/billing/domain/subscription.type';

export class SubscriptionUseCase {
  private paymentService: PaymentService;

  constructor(private userRepository: IUserRepository) {
    this.paymentService = new PaymentService();
  }

  async checkout(userId: string) {
    const existingUser = await this.userRepository.getUserAndPaymentAccountById(userId);
    if (!existingUser || !existingUser.active) {
      throw new NotFoundError('User invalid or user not active');
    }

    const stripeCustomerId = existingUser.paymentAccountId?.stripeCustomerId;

    try {
      // 1. Realiza a assinatura no Stripe (a lógica de assinatura pode ser mais complexa dependendo do plano e opções)
      const sessionURL = await this.paymentService.updatePlanToPro(stripeCustomerId, userId);

      Logger.info(`Session initialized to change plan PRO: ${sessionURL}`);

      return sessionURL;
    } catch (error: any) {
      Logger.error(`Error during session initialization: ${error.message}`);
      throw new BadRequestError(`Failed to initialize session: ${error.message}`);
    }
  }

  //Se for usar o webhook não usar esse método, pois a confirmação do pagamento será feita no webhook
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
      const subscriptionData = await this.paymentService.confirmPayment(sessionId);
      await this.upgradeToPaidPlan(subscriptionData, UserRole.OWNER);

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

  //Dispara em caso de confirmação de pagamento e falhas
  async webhookHandler(payload: Buffer<ArrayBuffer>, sig: string) {
    try {
      const subscription = await this.paymentService.handleWebhook(payload, sig);

      if (!subscription) {
        Logger.info(`Event ignored - no subscription data to process`);
        return {
          status: 'ignored',
          message: 'Event ignored - not a checkout.session.completed event'
        }; // Retorna resposta de sucesso para eventos ignorados
      }

      await this.upgradeToPaidPlan(subscription, UserRole.OWNER);

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

  async cancelSubscription(userId: string) {
    try {
      const existingUser = await this.userRepository.getUserAndPaymentAccountById(userId);
      if (!existingUser || !existingUser.paymentAccountId) {
        throw new NotFoundError('User or payment account not found');
      }

      // Cancelar assinatura no Stripe
      const cancelledSubscription = await this.paymentService.cancelSubscription(existingUser.paymentAccountId.stripeSubscriptionId);

      // Atualizar plano do usuário para FREE no DB
      await this.downgradeToFreePlan(userId, cancelledSubscription);

      Logger.info(`Subscription cancelled for user: ${userId}`);
    } catch (error: any) {
      Logger.error(`Error cancelling subscription: ${error.message}`);
      throw new BadRequestError(`Failed to cancel subscription: ${error.message}`);
    }
  }

  private async upgradeToPaidPlan(subscriptionData: ResolvedSubscription, role: UserRole) {
    // add role user to add OWNER and updateAt
    await this.userRepository.addUserRole(subscriptionData.userId, role);

    await PaymentAccountModel.findOneAndUpdate(
      { stripeCustomerId: subscriptionData.stripeCustomerId },
      {
        stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
        stripePriceId: subscriptionData.stripePriceId,
        unitAmount: subscriptionData.unitAmount,
        currentPeriodStart: subscriptionData.currentPeriodStart,
        stripeSubscriptionStatus: subscriptionData.stripeSubscriptionStatus,
        plan: subscriptionData.plan,
        updatedAt: formatISOWithTimezone(subscriptionData.currentPeriodStart) // Ajuste para o timezone de Brasília (UTC-3)
      },
      { new: true }
    );
  }

  private async downgradeToFreePlan(userId: string, cancelledSubscription: any) {
    await this.userRepository.removeUserRole(userId, UserRole.OWNER);

    await PaymentAccountModel.findOneAndUpdate(
      { stripeCustomerId: cancelledSubscription.stripeCustomerId },
      {
        stripeSubscriptionId: cancelledSubscription.stripeSubscriptionId,
        stripePriceId: cancelledSubscription.stripePriceId,
        unitAmount: cancelledSubscription.unitAmount,
        currentPeriodStart: cancelledSubscription.currentPeriodStart,
        stripeSubscriptionStatus: cancelledSubscription.stripeSubscriptionStatus,
        plan: cancelledSubscription.plan,
        updatedAt: formatISOWithTimezone(cancelledSubscription.currentPeriodStart) // Ajuste para o timezone de Brasília (UTC-3)
      },
      { new: true }
    );
  }
}
