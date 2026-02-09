// src/middlewares/error.middleware.ts
import { ApiError } from '@/core/errors/api-error';
import type { Elysia } from 'elysia';

export function errorMiddleware(app: Elysia) {
  app.onError((ctx) => {
    const { error, set, request, code } = ctx;

    // 🔹 Erro de validação do Elysia
    if (code === 'VALIDATION') {
      set.status = 400;

      return {
        success: false,
        message: 'Erro de validação',
        code: 'VALIDATION_ERROR',
        details: error
      };
    }

    // 🔹 Erros conhecidos da aplicação
    if (error instanceof ApiError) {
      set.status = error.statusCode;

      return {
        success: false,
        message: error.message,
        code: error.code
      };
    }

    console.error('[INTERNAL_ERROR]', {
      path: request.url,
      error
    });

    set.status = 500;
    return {
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    };
  });
}
