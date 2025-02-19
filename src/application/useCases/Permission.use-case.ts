import { IPermissionRepository } from '@/domain/ports/Permission.repository';
import { Errors } from 'moleculer';
import {
  PermissionResponseDTO,
  toPermissionResponseDTO,
} from '../dtos/Permission.dto';

export class PermissionUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async getAllPermissions(): Promise<PermissionResponseDTO[]> {
    const permissions = await this.permissionRepository.getAll();
    return permissions.map(toPermissionResponseDTO);
  }

  async getPermissionById(id: string): Promise<PermissionResponseDTO> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission)
      throw new Errors.MoleculerClientError(
        'Registro não encontrado',
        404,
        'P2025'
      );
    return toPermissionResponseDTO(permission);
  }
}
