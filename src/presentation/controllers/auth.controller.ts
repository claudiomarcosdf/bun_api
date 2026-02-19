import { LoginUserUseCase } from '@/application/use-cases/login-user.use-case';
import { VerifyUserUseCase } from '@/application/use-cases/verify-user.use-case';
import { ResetPasswordUseCase } from '@/application/use-cases/reset-password.use-case';
import { MongooseUserRepository } from '@/infrastructure/repositories/mongoose-user.repository';
import { UnauthorizedError } from '@/core/errors/api-error';
import { env } from '@/core/config/env';

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

    return {
      user: {
        sub: payload.sub,
        user_name: payload.user_name,
        email: payload.email,
        roles: payload.roles
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
