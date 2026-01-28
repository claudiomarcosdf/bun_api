import { Elysia } from 'elysia';
import { ApiError } from '@/core/errors/api-error';
import { Logger } from '@/core/logger/logger';

export const errorMiddleware = new Elysia()
  .error({
    API_ERROR: ApiError
  })
  .onError(({ code, error, set }) => {
    // 1. Extraímos a mensagem de forma segura
    // Verificamos se o erro é uma instância de Error ou se possui a propriedade message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    Logger.error(`Error occurred: ${errorMessage}`, { code, stack: errorStack });

    // 2. Tratamento para nossos erros customizados (SOLID)
    if (error instanceof ApiError) {
      set.status = error.statusCode;
      return {
        status: 'error',
        code: error.code,
        message: error.message,
        details: error.details
      };
    }

    // 3. Tratamento para erros de validação do Elysia (Zod/TypeBox)
    if (code === 'VALIDATION') {
      set.status = 422;
      return {
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error instanceof Error ? error.message : error
      };
    }

    // 4. Erro genérico para qualquer outra falha
    set.status = 500;
    return {
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    };
  });
