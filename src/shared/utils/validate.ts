import { ZodType } from 'zod';

export function validate<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw {
      type: 'validation',
      message: 'Erro de validação',
      issues: result.error.issues
    };
  }

  return result.data;
}
