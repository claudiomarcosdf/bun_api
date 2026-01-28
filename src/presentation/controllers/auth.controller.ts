import { LoginUserUseCase } from '@/application/use-cases/login-user.use-case';
import { VerifyUserUseCase } from '@/application/use-cases/verify-user.use-case';
import { ResetPasswordUseCase } from '@/application/use-cases/reset-password.use-case';
import { MongooseUserRepository } from '@/infrastructure/repositories/mongoose-user.repository';

export class AuthController {
  private userRepository: MongooseUserRepository;
  private verifyUserUseCase: VerifyUserUseCase;
  private resetPasswordUseCase: ResetPasswordUseCase;

  constructor() {
    // Inicializamos as dependências necessárias
    this.userRepository = new MongooseUserRepository();
    this.verifyUserUseCase = new VerifyUserUseCase(this.userRepository);
    this.resetPasswordUseCase = new ResetPasswordUseCase(this.userRepository);
  }

  async login({ body, jwt }: any) {
    const loginUseCase = new LoginUserUseCase(this.userRepository, jwt);
    return await loginUseCase.execute(body);
  }

  async verify({ query }: any) {
    return await this.verifyUserUseCase.execute({ code: query.code });
  }

  async forgotPassword({ body }: any) {
    return await this.resetPasswordUseCase.requestReset(body.email);
  }

  async resetPassword({ body }: any) {
    return await this.resetPasswordUseCase.executeReset(body);
  }
}
