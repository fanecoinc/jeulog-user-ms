import { Permission } from './Permission';

export class Role {
  constructor(
    public readonly id: string,
    public name: string,
    public createdAt: Date,
    public permissions: Permission[] = [],
    public updatedAt?: Date,
    public deletedAt?: Date
  ) {}
}
