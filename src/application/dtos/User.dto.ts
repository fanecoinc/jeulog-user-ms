import { User } from '@/domain/entities/User';

export interface CreateUserDTO {
  email: string;
  fullName: string;
  password: string;
  roleId: string;
  permissionIds: string[];
  active?: boolean;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  roleId?: string;
  permissionIds?: string[];
  active?: boolean;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string;
  role: { id: string; name: string };
  permissions: { id: string; code: string; name: string }[];
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
      ? { id: user.role.id, name: user.role.name }
      : { id: user.roleId, name: 'Desconhecido' },
    permissions: user.permissions.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
    })),
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}
