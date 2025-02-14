import { IRoleRepository } from '@/domain/ports/Role.repository';
import { IPermissionRepository } from '@/domain/ports/Permission.repository';
import {
  CreateRoleDTO,
  UpdateRoleDTO,
  RoleResponseDTO,
  toRoleResponseDTO,
} from '../dtos/Role.dto';
import { Role } from '@/domain/entities/Role';
import { v4 as uuidv4 } from 'uuid';

export class RoleUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly permissionRepository: IPermissionRepository
  ) {}

  async createRole(dto: CreateRoleDTO): Promise<RoleResponseDTO> {
    const permissions = await Promise.all(
      dto.permissionIds.map(async (id) => {
        const obj = await this.permissionRepository.findById(id);
        if (!obj) {
          throw new Error('Permissão inexistente');
        }
        return obj;
      })
    );

    const role = new Role(uuidv4(), dto.name, new Date(), permissions);

    const createdRole = await this.roleRepository.create(role);
    return toRoleResponseDTO(createdRole);
  }

  async updateRole(id: string, dto: UpdateRoleDTO): Promise<RoleResponseDTO> {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new Error('Cargo não encontrado');

    const permissions = dto.permissionIds
      ? await Promise.all(
          dto.permissionIds.map(async (id) => {
            const obj = await this.permissionRepository.findById(id);
            if (!obj) {
              throw new Error('Permissão inexistente');
            }
            return obj;
          })
        )
      : undefined;

    const updatedRole = await this.roleRepository.update(role.id, {
      ...dto,
      permissions,
      updatedAt: new Date(),
    });

    return toRoleResponseDTO(updatedRole);
  }

  async getRoleById(id: string): Promise<RoleResponseDTO> {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new Error('Cargo não encontrado');
    return toRoleResponseDTO(role);
  }

  async getAllRoles(): Promise<RoleResponseDTO[]> {
    const roles = await this.roleRepository.getAll();
    return roles.map(toRoleResponseDTO);
  }
}
