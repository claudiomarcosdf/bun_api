import { RegisterUserUseCase } from '@/application/use-cases/register-user.use-case';
import { MongooseUserRepository } from '@/infrastructure/repositories/mongoose-user.repository';
import { EmailService } from '@/infrastructure/services/email.service';

export class UserController {
  private userRepository: MongooseUserRepository;
  private emailService: EmailService;
  private registerUserUseCase: RegisterUserUseCase;

  constructor() {
    this.userRepository = new MongooseUserRepository();
    this.emailService = new EmailService();
    this.registerUserUseCase = new RegisterUserUseCase(this.userRepository, this.emailService);
  }

  async register({ body }: any) {
    return await this.registerUserUseCase.execute(body);
  }
}
