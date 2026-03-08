import { IUserRepository } from '@/modules/auth/infrastructure/interface/user.repository';
import { UnauthorizedError, ForbiddenError } from '@/core/errors/api-error';
import { Logger } from '@/core/logger/logger';
import { CookieType } from '@/modules/auth/domain/auth.types';
import { env } from '@/core/config/env';
import { RoleObfuscation } from '@/shared/constants/roleobfuscation';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: { sign: (payload: any) => Promise<string> }
  ) {}

  async execute(data: any, cookie: CookieType) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await Bun.password.verify(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.active) {
      throw new ForbiddenError('Please verify your email before logging in');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles
    };

    const token = await this.jwtService.sign(payload);

    // Seta o JWT num cookie HttpOnly — invisível para qualquer JS no browser
    cookie.auth_token.set({
      value: token,
      httpOnly: true,
      secure: env.NODE_ENV === 'production', // false em dev (sem HTTPS)
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 dia em segundos
      path: '/'
    });

    Logger.info(`User logged in: ${user.email}`);

    const payloadUser = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((role) => RoleObfuscation[role as keyof typeof RoleObfuscation] || 'unknown')
    };

    return {
      user: payloadUser // Retorna as roles ofuscadas para o frontend
    };
  }
}
