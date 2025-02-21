import { IUserRepository } from '@/domain/ports/User.repository';
import { IPermissionRepository } from '@/domain/ports/Permission.repository';
import { IRoleRepository } from '@/domain/ports/Role.repository';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserAuthDTO,
  UserResponseDTO,
  toUserResponseDTO,
} from '../dtos/User.dto';
import { User } from '@/domain/entities/User';
import { v4 as uuidv4 } from 'uuid';
import { Errors } from 'moleculer';

export class UserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly permissionRepository: IPermissionRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  async createUser(dto: CreateUserDTO): Promise<UserResponseDTO> {
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

    const role = await this.roleRepository.findById(dto.roleId);
    if (!role) {
      throw new Errors.MoleculerClientError(
        'Registro não encontrado',
        404,
        'P2025'
      );
    }

    const allPermissions = [
      ...new Map(
        [...role.permissions, ...permissions].map((p) => [p.id, p])
      ).values(),
    ];

    const user = new User(
      uuidv4(),
      dto.email,
      dto.fullName,
      dto.password,
      dto.active ?? true,
      new Date(),
      dto.roleId,
      role,
      allPermissions
    );

    const createdUser = await this.userRepository.create(user);
    return toUserResponseDTO(createdUser);
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user)
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
      : user.permissions;

    const role = dto.roleId
      ? await this.roleRepository.findById(dto.roleId)
      : await this.roleRepository.findById(user.roleId);

    if (!role) {
      throw new Errors.MoleculerClientError(
        'Registro não encontrado',
        404,
        'P2025'
      );
    }

    const allPermissions = [
      ...new Map(
        [...role.permissions, ...permissions].map((p) => [p.id, p])
      ).values(),
    ];

    const updatedUser = await this.userRepository.update(user.id, {
      ...dto,
      permissions: allPermissions,
      updatedAt: new Date(),
    });

    return toUserResponseDTO(updatedUser);
  }

  async getUserById(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user)
      throw new Errors.MoleculerClientError('Registro não encontrado', 404);
    return toUserResponseDTO(user);
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.getAll();
    return users.map(toUserResponseDTO);
  }

  async authenticate(
    user: UserAuthDTO
  ): Promise<Record<string, string | number>> {
    const obj = await this.userRepository.authenticate(user);
    if (!obj) {
      throw new Errors.MoleculerClientError('Email ou senha incorretos', 401);
    }
    return obj;
  }
}
