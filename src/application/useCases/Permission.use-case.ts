import { IPermissionRepository } from '@/domain/ports/Permission.repository';
import {
  PermissionResponseDTO,
  toPermissionResponseDTO,
} from '../dtos/Permission.dto';
import { Permission } from '@/domain/entities/Permission';

export class PermissionUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async getAllPermissions(): Promise<PermissionResponseDTO[]> {
    const permissions = await this.permissionRepository.getAll();
    return permissions.map(toPermissionResponseDTO);
  }

  async getPermissionById(id: string): Promise<PermissionResponseDTO> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) throw new Error('Permissão não encontrada');
    return toPermissionResponseDTO(permission);
  }
}
