import { Permission } from './Permission';
import { Role } from './Role';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public fullName: string,
    public password: string,
    public active: boolean,
    public createdAt: Date,
    public roleId: string,
    public role?: Role,
    public permissions: Permission[] = [],
    public updatedAt?: Date,
    public deletedAt?: Date
  ) {}

  getPermissions(): Permission[] {
    return this.permissions;
  }

  addPermission(permission: Permission): void {
    const exists = this.permissions.some((p) => p.code === permission.code);
    if (!exists) {
      this.permissions.push(permission);
    }
  }

  removePermission(permissionId: string): void {
    this.permissions = this.permissions.filter((p) => p.id !== permissionId);
  }

  hasPermission(permissionId: string): boolean {
    return this.permissions.some((p) => p.id === permissionId);
  }
}
