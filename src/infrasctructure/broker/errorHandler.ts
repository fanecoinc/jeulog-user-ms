import { Errors, ServiceBroker } from 'moleculer';
import { Prisma } from '@prisma/client';
import { BrokerErrorHandlerInfo } from 'moleculer';

export function errorHandler(
  this: ServiceBroker,
  err: Error,
  info: BrokerErrorHandlerInfo
): void {
  if (err instanceof Prisma.PrismaClientValidationError) {
    throw new Errors.MoleculerClientError(
      'Verifique se todos os campos obrigatórios foram preenchidos corretamente.',
      400,
      'PRISMA_VALIDATION_ERROR',
      { details: err.message }
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        throw new Errors.MoleculerClientError(
          'Já existe um registro com este valor único.',
          400,
          'PRISMA_UNIQUE_CONSTRAINT',
          { details: err.message }
        );
      case 'P2003':
        throw new Errors.MoleculerClientError(
          'Violação de chave estrangeira.',
          400,
          'PRISMA_FOREIGN_KEY_CONSTRAINT',
          { details: err.message }
        );
      case 'P2025':
        throw new Errors.MoleculerClientError(
          'Registro não encontrado.',
          404,
          'PRISMA_RECORD_NOT_FOUND',
          { details: err.message }
        );
      default:
        throw new Errors.MoleculerServerError(
          'Erro desconhecido no banco de dados.',
          500,
          'PRISMA_UNKNOWN_ERROR',
          { details: err.message }
        );
    }
  }

  throw new Errors.MoleculerServerError(
    'Erro interno no servidor',
    500,
    'INTERNAL_SERVER_ERROR',
    { details: err.message }
  );
}
