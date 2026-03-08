import { LoginUserUseCase } from '@/modules/auth/application/login-user.use-case';
import { VerifyUserUseCase } from '@/modules/auth/application/verify-user.use-case';
import { ResetPasswordUseCase } from '@/modules/auth/application/reset-password.use-case';
import { MongooseUserRepository } from '@/modules/auth/infrastructure/mongoose-user.repository';
import { UnauthorizedError } from '@/core/errors/api-error';
import { env } from '@/core/config/env';
import { EmailService } from '@/infrastructure/services/email.service';
import { RoleObfuscation } from '@/shared/constants/roleobfuscation';
import { UserRole } from '@/modules/auth/domain/user.entity';
import { RegisterUserUseCase } from '@/modules/auth/application/register-user.use-case';

export class AuthController {
  private userRepository: MongooseUserRepository;
  private registerUserUseCase: RegisterUserUseCase;
  private verifyUserUseCase: VerifyUserUseCase;
  private resetPasswordUseCase: ResetPasswordUseCase;
  private emailService: EmailService;

  constructor() {
    // Inicializamos as dependências necessárias
    this.userRepository = new MongooseUserRepository();
    this.emailService = new EmailService();
    this.registerUserUseCase = new RegisterUserUseCase(this.userRepository, this.emailService);
    this.verifyUserUseCase = new VerifyUserUseCase(this.userRepository);
    this.resetPasswordUseCase = new ResetPasswordUseCase(this.userRepository, this.emailService);
  }

  async register({ body }: any) {
    return await this.registerUserUseCase.execute(body);
  }

  async login({ body, jwt, cookie }: any) {
    const loginUseCase = new LoginUserUseCase(this.userRepository, jwt);
    return await loginUseCase.execute(body, cookie);
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

  async me({ jwt, cookie }: any) {
    const token = cookie?.auth_token?.value;

    if (!token) {
      throw new UnauthorizedError('No session found');
    }

    const payload = await jwt.verify(token);

    if (!payload) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    const user = await this.userRepository.getUserAndPaymentAccountById(payload.sub);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      user: {
        sub: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles.map((role: UserRole) => RoleObfuscation[role as keyof typeof RoleObfuscation] || 'unknown'),
        subscription: {
          plan: user.paymentAccountId.plan || 'FREE',
          currentPeriodStart: user.paymentAccountId.currentPeriodStart || null,
          unitAmount: user.paymentAccountId.unitAmount || 0
        }
      }
    };
  }

  async logout({ cookie }: any) {
    // Expira o cookie imediatamente
    cookie.auth_token.set({
      value: '',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // expira na hora
      path: '/'
    });

    return { message: 'Logged out successfully' };
  }
}
