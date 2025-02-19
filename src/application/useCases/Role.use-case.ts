import { IRoleRepository } from '@/domain/ports/Role.repository';
import { IPermissionRepository } from '@/domain/ports/Permission.repository';
import { Errors } from 'moleculer';
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
          throw new Errors.MoleculerClientError(
            'Registro não encontrado',
            404,
            'P2025'
          );
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
    if (!role)
      throw new Errors.MoleculerClientError(
        'Registro não encontrado',
        404,
        'P2025'
      );

    const permissions = dto.permissionIds
      ? await Promise.all(
          dto.permissionIds.map(async (id) => {
            const obj = await this.permissionRepository.findById(id);
            if (!obj) {
              throw new Errors.MoleculerClientError(
                'Registro não encontrado',
                404,
                'P2025'
              );
            }
            return obj;
          })
        )
      : undefined;

    const { permissionIds, ...rest } = dto;
    const updatedRole = await this.roleRepository.update(role.id, {
      ...rest,
      permissions,
      updatedAt: new Date(),
    });

    return toRoleResponseDTO(updatedRole);
  }

  async getRoleById(id: string): Promise<RoleResponseDTO> {
    const role = await this.roleRepository.findById(id);
    if (!role)
      throw new Errors.MoleculerClientError(
        'Registro não encontrado',
        404,
        'P2025'
      );
    return toRoleResponseDTO(role);
  }

  async getAllRoles(): Promise<RoleResponseDTO[]> {
    const roles = await this.roleRepository.getAll();
    return roles.map(toRoleResponseDTO);
  }
}
