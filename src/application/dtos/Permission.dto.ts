import { Permission } from '@/domain/entities/Permission';

export interface PermissionResponseDTO {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export function toPermissionResponseDTO(
  permission: Permission
): PermissionResponseDTO {
  return {
    id: permission.id,
    code: permission.code,
    name: permission.name,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
    deletedAt: permission.deletedAt,
  };
}
