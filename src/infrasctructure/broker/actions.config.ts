import { Context } from 'moleculer';
import { PrismaPermissionRepository } from '../adapters/Permission.prisma-adapter';
import { PrismaUserRepository } from '../adapters/User.prisma-adapter';
import { PrismaRoleRepository } from '../adapters/Role.prisma-adapter';
import { PermissionService } from '@/services/Permission.service';
import { UserService } from '@/services/User.service';
import { RoleService } from '@/services/Role.service';
import { StandardParameter } from './parameters';
import { CreateRoleDTO } from '@/application/dtos/Role.dto';
import { CreateUserDTO } from '@/application/dtos/User.dto';
import { PermissionResponseDTO } from '@/application/dtos/Permission.dto';
import { errorHandler } from './errorHandler';
import { uuidSchema } from '../schemas/Common.schema';
import { roleCreationSchema, roleEditSchema } from '../schemas/Role.schema';

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
  async getPermissions(_ctx: Context) {
    try {
      return await permissionService.getAllPermissions();
    } catch (e) {
      errorHandler(e as Error);
    }
  },

  async getPermissionById(
    ctx: Context<StandardParameter<PermissionResponseDTO>>
  ) {
    try {
      const { id } = ctx.params;
      uuidSchema.parse(id);
      return await permissionService.getPermissionById(id);
    } catch (e) {
      errorHandler(e as Error);
    }
  },

  // Roles
  async getRoles(_ctx: Context) {
    try {
      return await roleService.getAllRoles();
    } catch (e) {
      errorHandler(e as Error);
    }
  },

  async getRoleById(ctx: Context<StandardParameter<CreateRoleDTO>>) {
    try {
      const { id } = ctx.params;
      uuidSchema.parse(id);
      return await roleService.getRoleById(id);
    } catch (e) {
      errorHandler(e as Error);
    }
  },

  async createRole(ctx: Context<StandardParameter<CreateRoleDTO>>) {
    try {
      const { name, permissionIds } = ctx.params;
      const dto = {
        name,
        permissionIds,
      };
      roleCreationSchema.parse(dto);
      return await roleService.createRole(dto);
    } catch (e) {
      errorHandler(e as Error);
    }
  },

  async editRole(ctx: Context<StandardParameter<CreateRoleDTO>>) {
    try {
      const { name, permissionIds, id } = ctx.params;
      uuidSchema.parse(id);
      const dto = {
        name,
        permissionIds,
      };
      roleEditSchema.parse(dto);
      return await roleService.editRole(id, dto);
    } catch (e) {
      console.log(e);
      errorHandler(e as Error);
    }
  },

  // Users
  async getUsers(_ctx: Context) {
    try {
      return await userService.getAllUsers();
    } catch (e) {
      errorHandler(e as Error);
    }
  },

  async getUserById(ctx: Context<StandardParameter<CreateUserDTO>>) {
    try {
      const { id } = ctx.params;
      uuidSchema.parse(id);
      return await userService.getUserById(id);
    } catch (e) {
      errorHandler(e as Error);
    }
  },

  async createUser(ctx: Context<StandardParameter<CreateUserDTO>>) {
    try {
      const { id, ...dto } = ctx.params;
      uuidSchema.parse(id);
      return await userService.createUser(dto);
    } catch (e) {
      errorHandler(e as Error);
    }
  },

  async editUser(ctx: Context<StandardParameter<CreateUserDTO>>) {
    try {
      const { id, ...dto } = ctx.params;
      uuidSchema.parse(id);
      return await userService.editUser(id, dto);
    } catch (e) {
      errorHandler(e as Error);
    }
  },
};

export { actions };
