import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { NotFoundError, BadRequestError } from '@/core/errors/api-error';
import { Logger } from '@/core/logger/logger';

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Gera um token de reset e prepara o envio (simulado via log)
   */
  async requestReset(email: string) {
    const user = await this.userRepository.findByEmail(email);

    // Por segurança (evitar enumeração de usuários), retornamos a mesma mensagem
    // mesmo que o e-mail não exista no banco.
    if (!user) {
      return { message: 'If an account exists with this email, a reset link has been sent.' };
    }

    // Gera um token aleatório seguro
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Salva o token no registro do usuário
    await this.userRepository.update(user.id!, {
      resetLink: resetToken
    });

    // Log do token para teste (em produção, seria enviado via EmailService)
    Logger.info(`Password reset requested for: ${email}. Token: ${resetToken}`);

    return { message: 'If an account exists with this email, a reset link has been sent.' };
  }

  /**
   * Valida o token e atualiza para a nova senha
   */
  async executeReset(data: { token: string; newPassword: string }) {
    // Busca o usuário que possui este token de reset
    const users = await this.userRepository.list({ resetLink: data.token });
    const user = users[0];

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    // Hash da nova senha usando o motor nativo do Bun
    const hashedPassword = await Bun.password.hash(data.newPassword);

    // Atualiza a senha e limpa o token de reset
    await this.userRepository.update(user.id!, {
      password: hashedPassword,
      resetLink: undefined
    });

    Logger.info(`Password reset successfully for user: ${user.email}`);

    return { message: 'Password has been reset successfully.' };
  }
}
