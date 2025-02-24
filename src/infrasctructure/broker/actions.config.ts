import { Context } from 'moleculer';
import { PrismaPermissionRepository } from '../adapters/Permission.prisma-adapter';
import { PrismaUserRepository } from '../adapters/User.prisma-adapter';
import { PrismaRoleRepository } from '../adapters/Role.prisma-adapter';
import { PermissionService } from '@/services/Permission.service';
import { UserService } from '@/services/User.service';
import { RoleService } from '@/services/Role.service';
import { StandardParameter } from './parameters';
import { CreateRoleDTO } from '@/application/dtos/Role.dto';
import { CreateUserDTO, UserAuthDTO } from '@/application/dtos/User.dto';
import { PermissionResponseDTO } from '@/application/dtos/Permission.dto';
import { errorHandler } from './errorHandler';
import { uuidSchema } from '../schemas/Common.schema';
import { roleCreationSchema, roleEditSchema } from '../schemas/Role.schema';
import {
  userAuthSchema,
  userCreationSchema,
  userEditSchema,
  userResetPasswordSchema,
} from '../schemas/User.schema';

const permissionRepository = new PrismaPermissionRepository();
const roleRepository = new PrismaRoleRepository();
const userRepository = new PrismaUserRepository();
const permissionService = new PermissionService(permissionRepository);
const roleService = new RoleService(roleRepository, permissionRepository);
const userService = new UserService(
  userRepository,
  permissionRepository,
  roleRepository
);

const actions = {
  // Permissions
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

  // Roles
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
      $$strict: 'remove',
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
      $$strict: 'remove',
      name: { type: 'string', optional: true },
      permissionIds: { type: 'array', items: 'string', optional: true },
    },
  },

  // Users
  getUsers: {
    handler: async (_ctx: Context) => {
      return await userService.getAllUsers().catch(errorHandler);
    },
    openapi: {
      description: 'Recupera todos os usuários',
      summary: 'Recupera todos os usuários',
    },
  },

  getUserById: {
    handler: async (ctx: Context<StandardParameter<CreateUserDTO>>) => {
      const { id } = ctx.params;
      await uuidSchema.parseAsync(id).catch(errorHandler);
      return await userService.getUserById(id).catch(errorHandler);
    },
    openapi: {
      description: 'Recupera usuário pelo ID',
      summary: 'Recupera usuário pelo ID',
    },
  },

  createUser: {
    handler: async (ctx: Context<StandardParameter<CreateUserDTO>>) => {
      await userCreationSchema.parseAsync(ctx.params).catch(errorHandler);
      return await userService.createUser(ctx.params).catch(errorHandler);
    },
    openapi: {
      description: 'Criação de usuário',
      summary: 'Criação de usuário',
    },
    params: {
      $$strict: 'remove',
      email: { type: 'string', optional: false },
      password: { type: 'string', optional: false },
      fullName: { type: 'string', optional: false },
      roleId: { type: 'string', optional: false },
      permissionIds: { type: 'array', items: 'string', optional: false },
      active: { type: 'boolean', optional: false },
    },
  },

  editUser: {
    handler: async (ctx: Context<StandardParameter<CreateUserDTO>>) => {
      const { id, ...dto } = ctx.params;
      await uuidSchema.parseAsync(id).catch(errorHandler);
      await userEditSchema.parseAsync(dto).catch(errorHandler);
      return await userService.editUser(id, dto).catch(errorHandler);
    },
    openapi: {
      description: 'Edição de usuário',
      summary: 'Edição de usuário',
    },
    params: {
      $$strict: 'remove',
      email: { type: 'string', optional: true },
      fullName: { type: 'string', optional: true },
      roleId: { type: 'string', optional: true },
      permissionIds: { type: 'array', items: 'string', optional: true },
      active: { type: 'boolean', optional: true },
    },
  },

  resetPassword: {
    handler: async (ctx: Context<StandardParameter<CreateUserDTO>>) => {
      const { id, ...dto } = ctx.params;
      await uuidSchema.parseAsync(id).catch(errorHandler);
      await userResetPasswordSchema.parseAsync(dto).catch(errorHandler);
      return await userService.editUser(id, dto).catch(errorHandler);
    },
    openapi: {
      description: 'Reseta a senha do usuário',
      summary: 'Reseta a senha do usuário',
    },
    params: {
      $$strict: 'remove',
      password: 'string',
    },
  },

  authUser: {
    handler: async (ctx: Context<StandardParameter<UserAuthDTO>>) => {
      await userAuthSchema.parseAsync(ctx.params).catch(errorHandler);
      return await userService.authenticateUser(ctx.params).catch(errorHandler);
    },
    openapi: {
      description: 'Autentica um usuário',
      summary: 'Autentica um usuário',
    },
    params: {
      $$strict: 'remove',
      email: 'string',
      password: 'string',
    },
  },
};

export { actions };
