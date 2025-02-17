import { PermissionUseCase } from '@/application/useCases/Permission.use-case';
import { PermissionResponseDTO } from '@/application/dtos/Permission.dto';
import { IPermissionRepository } from '@/domain/ports/Permission.repository';

export class PermissionService {
  private permissionUseCase: PermissionUseCase;

  constructor(private permissionRepository: IPermissionRepository) {
    this.permissionUseCase = new PermissionUseCase(this.permissionRepository);
  }

  async getAllPermissions(): Promise<PermissionResponseDTO[]> {
    return await this.permissionUseCase.getAllPermissions();
  }

  async getPermissionById(id: string): Promise<PermissionResponseDTO> {
    return await this.permissionUseCase.getPermissionById(id);
  }
}
