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
}
