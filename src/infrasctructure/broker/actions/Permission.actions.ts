import { Context } from 'moleculer';
import { PrismaPermissionRepository } from '@/infrasctructure/adapters/Permission.prisma-adapter';
import { PermissionService } from '@/services/Permission.service';
import { StandardParameter } from '../parameters';
import { PermissionResponseDTO } from '@/application/dtos/Permission.dto';
import { errorHandler } from '../errorHandler';
import { uuidSchema } from '@/infrasctructure/schemas/Common.schema';

const permissionRepository = new PrismaPermissionRepository();
const permissionService = new PermissionService(permissionRepository);

export const permissionActions = {
  getPermissions: {
    handler: async (_ctx: Context) => {
      return await permissionService.getAllPermissions().catch(errorHandler);
    },
    openapi: {
      description: 'Recupera todas as permissões',
      summary: 'Recupera todas as permissões',
    },
  },

  getPermissionById: {
    handler: async (ctx: Context<StandardParameter<PermissionResponseDTO>>) => {
      const { id } = ctx.params;
      await uuidSchema.parseAsync(id).catch(errorHandler);
      return await permissionService.getPermissionById(id).catch(errorHandler);
    },
    openapi: {
      description: 'Recupera permissão pelo ID',
      summary: 'Recupera permissão pelo ID',
    },
  },
};
