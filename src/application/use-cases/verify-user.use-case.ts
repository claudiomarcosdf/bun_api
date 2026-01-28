import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { NotFoundError, BadRequestError } from '@/core/errors/api-error';
import { Logger } from '@/core/logger/logger';
import { StripeService } from '@/infrastructure/external/stripe.service';
import { PaymentAccountModel } from '@/infrastructure/database/mongoose-schemas';

export class VerifyUserUseCase {
  private stripeService: StripeService;

  constructor(private userRepository: IUserRepository) {
    this.stripeService = new StripeService();
  }

  async execute(data: { code: string }) {
    const user = await this.userRepository.findByVerificationCode(data.code);

    if (!user) {
      throw new NotFoundError('Invalid verification code');
    }

    if (user.active) {
      throw new BadRequestError('User is already active');
    }

    try {
      // 1. Gera toda a estrutura financeira no Stripe através de um único método
      const stripeData = await this.stripeService.generateDefaultPaymentAccount(user.email, user.username);

      // 2. Cria a PaymentAccount no nosso banco com os dados retornados
      const paymentAccount = await PaymentAccountModel.create(stripeData);

      // 3. Ativa o usuário e vincula a conta de pagamento
      await this.userRepository.update(user.id!, {
        active: true,
        verification_code: '',
        payment_account_id: paymentAccount._id.toString()
      });

      Logger.info(`User activated and Stripe account initialized: ${user.email}`);

      return {
        message: 'Account activated successfully. Your FREE plan is now active.'
      };
    } catch (error: any) {
      Logger.error(`Error during user activation: ${error.message}`);
      throw new BadRequestError(`Failed to activate account: ${error.message}`);
    }
  }
}
