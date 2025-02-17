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
    return await permissionService.getAllPermissions();
  },

  async getPermissionById(
    ctx: Context<StandardParameter<PermissionResponseDTO>>
  ) {
    const { id } = ctx.params;
    return await permissionService.getPermissionById(id);
  },

  // Roles
  async getRoles(_ctx: Context) {
    return await roleService.getAllRoles();
  },

  async getRoleById(ctx: Context<StandardParameter<CreateRoleDTO>>) {
    const { id } = ctx.params;
    return await roleService.getRoleById(id);
  },

  async createRole(ctx: Context<StandardParameter<CreateRoleDTO>>) {
    const { name, permissionIds } = ctx.params;
    const dto = {
      name,
      permissionIds,
    };
    return await roleService.createRole(dto);
  },

  async editRole(ctx: Context<StandardParameter<CreateRoleDTO>>) {
    const { name, permissionIds, id } = ctx.params;
    const dto = {
      name,
      permissionIds,
    };
    return await roleService.editRole(id, dto);
  },

  // Users
  async getUsers(_ctx: Context) {
    return await userService.getAllUsers();
  },

  async getUserById(ctx: Context<StandardParameter<CreateUserDTO>>) {
    const { id } = ctx.params;
    return await userService.getUserById(id);
  },

  async createUser(ctx: Context<StandardParameter<CreateUserDTO>>) {
    const { id, ...dto } = ctx.params;
    return await userService.createUser(dto);
  },

  async editUser(ctx: Context<StandardParameter<CreateUserDTO>>) {
    const { id, ...dto } = ctx.params;
    return await userService.editUser(id, dto);
  },
};

export { actions };
