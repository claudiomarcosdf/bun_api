import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { EmailService } from '@/infrastructure/services/email.service';
import { ConflictError } from '@/core/errors/api-error';
import { UserRole } from '@/domain/entities/user.entity';
import { Logger } from '@/core/logger/logger';

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository, private emailService: EmailService) {}

  async execute(data: any) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Hash password (in a real scenario, use a proper hashing service)
    const hashedPassword = await Bun.password.hash(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      active: false,
      roles: [UserRole.USER],
      verification_code: verificationCode
    });

    await this.emailService.sendVerificationEmail(user.email, verificationCode);

    Logger.info(`User registered: ${user.email}`);

    return {
      id: user.id,
      email: user.email,
      message: 'User registered successfully. Please check your email for verification.'
    };
  }
}
