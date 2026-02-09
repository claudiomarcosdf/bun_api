import { Elysia } from 'elysia';
import { AuthController } from '@/presentation/controllers/auth.controller';
import { ForgotPasswordDTO, LoginUserDTO, ResetPasswordDTO, VerifyUserDTO } from '@/application/dtos/user.dto';

// Instanciamos o controller uma única vez
const authController = new AuthController();

export const openedRoutes = new Elysia({ prefix: '/auth' })
  // Note como as rotas apenas delegam a execução para o controller
  .post('/login', (context) => authController.login(context), {
    body: LoginUserDTO,
    detail: { summary: 'Login user', tags: ['Auth'] }
  })
  .get('/verify', (context) => authController.verify(context), {
    query: VerifyUserDTO,
    detail: { summary: 'Verify account', tags: ['Auth'] }
  })
  .post('/forgot-password', (context) => authController.forgotPassword(context), {
    body: ForgotPasswordDTO,
    detail: { summary: 'Request password reset', tags: ['Auth'] }
  })
  .post('/reset-password', (context) => authController.resetPassword(context), {
    body: ResetPasswordDTO,
    detail: { summary: 'Reset password', tags: ['Auth'] }
  });
