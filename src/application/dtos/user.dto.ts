import { t } from 'elysia';

export const RegisterUserDTO = t.Object({
  username: t.String(),
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 6 }),
  document: t.String()
});

export const VerifyUserDTO = t.Object({
  code: t.String()
});

export const LoginUserDTO = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String()
});

/**
 * Validação para a solicitação inicial de reset (apenas e-mail)
 */
export const ForgotPasswordDTO = t.Object({
  email: t.String({
    format: 'email',
    error: 'Invalid email format'
  })
});

/**
 * Validação para a troca efetiva da senha
 */
export const ResetPasswordDTO = t.Object({
  token: t.String({
    error: 'Reset token is required'
  }),
  newPassword: t.String({
    minLength: 6,
    error: 'New password must be at least 6 characters long'
  })
});
