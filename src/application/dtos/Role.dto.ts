import { Role } from '@/domain/entities/Role';

export interface CreateRoleDTO {
  name: string;
  permissionIds: string[];
}

export interface UpdateRoleDTO {
  name?: string;
  permissionIds?: string[];
}

export interface RoleResponseDTO {
  id: string;
  name: string;
  permissions: { id: string; code: string; name: string }[];
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export function toRoleResponseDTO(role: Role): RoleResponseDTO {
  return {
    id: role.id,
    name: role.name,
    permissions: role.permissions.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
    })),
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    deletedAt: role.deletedAt,
  };
}
