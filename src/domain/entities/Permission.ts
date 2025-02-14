export class Permission {
  constructor(
    public readonly id: string,
    public code: string,
    public name: string,
    public createdAt: Date,
    public updatedAt?: Date,
    public deletedAt?: Date
  ) {}
}
