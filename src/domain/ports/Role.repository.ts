import { Role } from '../entities/Role';

export interface IRoleRepository {
  getAll(): Promise<Role[]>;
  create(role: Role): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  update(id: string, role: Partial<Role>): Promise<Role>;
}
