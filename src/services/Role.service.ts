import { RoleUseCase } from '@/application/useCases/Role.use-case';
import {
  CreateRoleDTO,
  RoleResponseDTO,
  UpdateRoleDTO,
} from '@/application/dtos/Role.dto';
import { IRoleRepository } from '@/domain/ports/Role.repository';
import { IPermissionRepository } from '@/domain/ports/Permission.repository';

export class RoleService {
  constructor(
    private roleRepository: IRoleRepository,
    private permissionRepository: IPermissionRepository,
    private roleUseCase: RoleUseCase = new RoleUseCase(
      this.roleRepository,
      this.permissionRepository
    )
  ) {}

  async getAllRoles(): Promise<RoleResponseDTO[]> {
    return await this.roleUseCase.getAllRoles();
  }

  async getRoleById(id: string): Promise<RoleResponseDTO> {
    return await this.roleUseCase.getRoleById(id);
  }

  async createRole(dto: CreateRoleDTO): Promise<RoleResponseDTO> {
    return await this.roleUseCase.createRole(dto);
  }

  async editRole(id: string, dto: UpdateRoleDTO): Promise<RoleResponseDTO> {
    return await this.roleUseCase.updateRole(id, dto);
  }
}
