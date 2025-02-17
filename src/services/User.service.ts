import { UserUseCase } from '@/application/useCases/User.use-case';
import {
  CreateUserDTO,
  UserResponseDTO,
  UpdateUserDTO,
} from '@/application/dtos/User.dto';
import { IUserRepository } from '@/domain/ports/User.repository';
import { IPermissionRepository } from '@/domain/ports/Permission.repository';
import { IRoleRepository } from '@/domain/ports/Role.repository';

export class UserService {
  private userUseCase: UserUseCase;

  constructor(
    private UserRepository: IUserRepository,
    private permissionRepository: IPermissionRepository,
    private roleRepository: IRoleRepository
  ) {
    this.userUseCase = new UserUseCase(
      this.UserRepository,
      this.permissionRepository,
      this.roleRepository
    );
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    return await this.userUseCase.getAllUsers();
  }

  async getUserById(id: string): Promise<UserResponseDTO> {
    return await this.userUseCase.getUserById(id);
  }

  async createUser(dto: CreateUserDTO): Promise<UserResponseDTO> {
    return await this.userUseCase.createUser(dto);
  }

  async editUser(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    return await this.userUseCase.updateUser(id, dto);
  }
}
