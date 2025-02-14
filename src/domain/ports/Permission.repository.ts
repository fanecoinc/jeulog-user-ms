import { Permission } from '../entities/Permission';

export interface IPermissionRepository {
  getAll(): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>;
}
