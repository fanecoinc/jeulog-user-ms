import { Context } from 'moleculer';
import { StandardParameter } from '../parameters';
import { errorHandler } from '../errorHandler';
import { uuidSchema } from '@/infrastructure/schemas/Common.schema';
import {
  roleCreationSchema,
  roleEditSchema,
} from '@/infrastructure/schemas/Role.schema';
import { CreateRoleDTO } from '@/application/dtos/Role.dto';
import { RoleService } from '@/services/Role.service';
import { PrismaRoleRepository } from '@/infrastructure/adapters/Role.prisma-adapter';
import { PrismaPermissionRepository } from '@/infrastructure/adapters/Permission.prisma-adapter';

const roleRepository = new PrismaRoleRepository();
const permissionRepository = new PrismaPermissionRepository();
const roleService = new RoleService(roleRepository, permissionRepository);

export const roleActions = {
  getRoles: {
    handler: async (_ctx: Context) => {
      return await roleService.getAllRoles().catch(errorHandler);
    },
    openapi: {
      description: 'Recupera todos os cargos',
      summary: 'Recupera todos os cargos',
    },
  },

  getRoleById: {
    handler: async (ctx: Context<StandardParameter<CreateRoleDTO>>) => {
      const { id } = ctx.params;
      await uuidSchema.parseAsync(id).catch(errorHandler);
      return await roleService.getRoleById(id).catch(errorHandler);
    },
    openapi: {
      description: 'Recupera cargo pelo ID',
      summary: 'Recupera cargo pelo ID',
    },
  },

  createRole: {
    handler: async (ctx: Context<StandardParameter<CreateRoleDTO>>) => {
      const { name, permissionIds } = ctx.params;
      const dto = {
        name,
        permissionIds,
      };
      await roleCreationSchema.parseAsync(dto).catch(errorHandler);
      return await roleService.createRole(dto).catch(errorHandler);
    },
    openapi: {
      description: 'Criação de cargo',
      summary: 'Criação de cargo',
    },
    params: {
      name: { type: 'string', optional: false },
      permissionIds: { type: 'array', items: 'string', optional: false },
    },
  },

  editRole: {
    handler: async (ctx: Context<StandardParameter<CreateRoleDTO>>) => {
      const { name, permissionIds, id } = ctx.params;
      await uuidSchema.parseAsync(id).catch(errorHandler);
      const dto = {
        name,
        permissionIds,
      };
      await roleEditSchema.parseAsync(dto).catch(errorHandler);
      return await roleService.editRole(id, dto).catch(errorHandler);
    },
    openapi: {
      description: 'Edição de cargo',
      summary: 'Edição de cargo',
    },
    params: {
      name: { type: 'string', optional: true },
      permissionIds: { type: 'array', items: 'string', optional: true },
    },
  },
};
