import { IUserRepository } from '@/modules/auth/infrastructure/interface/user.repository';
import { NotFoundError, BadRequestError } from '@/core/errors/api-error';
import { Logger } from '@/core/logger/logger';
import { PaymentService } from '@/infrastructure/payments/payment.service';
import { PaymentAccountModel } from '@/infrastructure/database/schemas';

export class VerifyUserUseCase {
  private paymentService: PaymentService;

  constructor(private userRepository: IUserRepository) {
    this.paymentService = new PaymentService();
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
      const stripeData = await this.paymentService.createDefaultAccount(user.email, user.username);

      // 2. Cria a PaymentAccount no nosso banco com os dados retornados
      const paymentAccount = await PaymentAccountModel.create(stripeData);

      // 3. Ativa o usuário e vincula a conta de pagamento
      await this.userRepository.update(user.id!, {
        active: true,
        verificationCode: null,
        paymentAccountId: paymentAccount._id.toString()
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
