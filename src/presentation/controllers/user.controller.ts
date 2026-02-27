import { RegisterUserUseCase } from '@/application/use-cases/register-user.use-case';
import { SubscriptionUseCase } from '@/application/use-cases/subscription.use-case';
import { MongooseUserRepository } from '@/infrastructure/repositories/mongoose-user.repository';
import { EmailService } from '@/infrastructure/services/email.service';

export class UserController {
  private userRepository: MongooseUserRepository;
  private emailService: EmailService;
  private registerUserUseCase: RegisterUserUseCase;
  private subscriptionUseCase: SubscriptionUseCase;

  constructor() {
    this.userRepository = new MongooseUserRepository();
    this.emailService = new EmailService();
    this.registerUserUseCase = new RegisterUserUseCase(this.userRepository, this.emailService);
    this.subscriptionUseCase = new SubscriptionUseCase(this.userRepository);
  }

  async register({ body }: any) {
    return await this.registerUserUseCase.execute(body);
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
}
