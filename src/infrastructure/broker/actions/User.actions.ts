import { Context } from 'moleculer';
import { StandardParameter } from '../parameters';
import { errorHandler } from '../errorHandler';
import { uuidSchema } from '@/infrastructure/schemas/Common.schema';
import {
  userAuthSchema,
  userCreationSchema,
  userEditSchema,
  userResetPasswordSchema,
} from '@/infrastructure/schemas/User.schema';
import { CreateUserDTO, UserAuthDTO } from '@/application/dtos/User.dto';
import { UserService } from '@/services/User.service';
import { PrismaPermissionRepository } from '@/infrastructure/adapters/Permission.prisma-adapter';
import { PrismaUserRepository } from '@/infrastructure/adapters/User.prisma-adapter';
import { PrismaRoleRepository } from '@/infrastructure/adapters/Role.prisma-adapter';

const permissionRepository = new PrismaPermissionRepository();
const roleRepository = new PrismaRoleRepository();
const userRepository = new PrismaUserRepository();
const userService = new UserService(
  userRepository,
  permissionRepository,
  roleRepository
);

export const userActions = {
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
      email: { type: 'string', optional: false },
      password: { type: 'string', optional: false },
      fullName: { type: 'string', optional: false },
      roleId: { type: 'string', optional: false },
      permissionIds: { type: 'array', items: 'string', optional: false },
      active: { type: 'boolean', optional: true },
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
      email: 'string',
      password: 'string',
    },
  },
};
