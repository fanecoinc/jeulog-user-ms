import { Errors } from 'moleculer';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function errorHandler(err: Error): never {
  if (err instanceof Prisma.PrismaClientValidationError) {
    throw new Errors.MoleculerClientError(
      'Verifique se todos os campos obrigatórios foram preenchidos corretamente',
      400,
      'PRISMA_VALIDATION_ERROR',
      { cause: err }
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        throw new Errors.MoleculerClientError(
          'Já existe um registro com este valor único',
          400,
          'P2002',
          { cause: err }
        );
      case 'P2003':
        throw new Errors.MoleculerClientError(
          'Violação de chave estrangeira',
          400,
          'P2003',
          { cause: err }
        );
      case 'P2025':
        throw new Errors.MoleculerClientError(
          'Registro não encontrado',
          404,
          'P2025',
          { cause: err }
        );
      default:
        throw new Errors.MoleculerServerError(
          'Erro desconhecido no banco de dados',
          500,
          'PRISMA_UNKNOWN_ERROR',
          { cause: err }
        );
    }
  }

  if (err instanceof ZodError) {
    throw new Errors.MoleculerClientError(
      'Erro de validação nos dados enviados',
      400,
      'ZodValidationError',
      {
        cause: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        summary: String(err),
      }
    );
  }

  if (err instanceof Errors.MoleculerClientError) {
    throw err;
  }

  throw new Errors.MoleculerServerError(
    'Erro desconhecido no servidor',
    500,
    'INTERNAL_SERVER_ERROR',
    { cause: err }
  );
}
