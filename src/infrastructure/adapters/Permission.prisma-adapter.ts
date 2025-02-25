import { Permission } from '@/domain/entities/Permission';
import { prismaClient } from '../database';
import { IPermissionRepository } from '@/domain/ports/Permission.repository';

export class PrismaPermissionRepository implements IPermissionRepository {
  async findById(id: string): Promise<Permission | null> {
    const permission = await prismaClient.permission.findUnique({
      where: { id },
    });
    if (!permission) return null;
    return new Permission(
      permission.id,
      permission.code,
      permission.name,
      permission.createdAt,
      permission.updatedAt ?? undefined,
      permission.deletedAt ?? undefined
    );
  }

  async getAll(): Promise<Permission[]> {
    const permissions = await prismaClient.permission.findMany();
    return permissions.map((instance: any) => {
      return new Permission(
        instance.id,
        instance.code,
        instance.name,
        instance.createdAt,
        instance.updatedAt ?? undefined,
        instance.deletedAt ?? undefined
      );
    });
  }
}
