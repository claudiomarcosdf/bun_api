import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { UnauthorizedError, ForbiddenError } from '@/core/errors/api-error';
import { Logger } from '@/core/logger/logger';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: { sign: (payload: any) => Promise<string> }
  ) {}

  async execute(data: any) {
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

    const token = await this.jwtService.sign({
      sub: user.id,
      user_name: user.username,
      email: user.email,
      roles: user.roles
    });

    Logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        sub: user.id,
        user_name: user.username,
        email: user.email,
        roles: user.roles
      },
      token
    };
  }
}
