import { IRoleRepository } from '@/domain/ports/Role.repository';
import { prismaClient } from '../database';
import { Role } from '@/domain/entities/Role';
import { Permission } from '@/domain/entities/Permission';

export class PrismaRoleRepository implements IRoleRepository {
  async getAll(): Promise<Role[]> {
    const roles = await prismaClient.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return roles.map((instance) => {
      return new Role(
        instance.id,
        instance.name,
        instance.createdAt,
        instance.permissions.map((p) => {
          return new Permission(
            p.permission.id,
            p.permission.code,
            p.permission.name,
            p.permission.createdAt,
            p.permission.updatedAt ?? undefined,
            p.permission.deletedAt ?? undefined
          );
        }),
        instance.updatedAt ?? undefined,
        instance.deletedAt ?? undefined
      );
    });
  }

  async create(role: Role): Promise<Role> {
    const createdRole = await prismaClient.role.create({
      data: {
        id: role.id,
        name: role.name,
        permissions: {
          create: role.permissions.map((p) => ({
            permission: { connect: { id: p.id } },
          })),
        },
        createdAt: role.createdAt,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return new Role(
      createdRole.id,
      createdRole.name,
      createdRole.createdAt,
      createdRole.permissions.map((p) => {
        return new Permission(
          p.permission.id,
          p.permission.code,
          p.permission.name,
          p.permission.createdAt,
          p.permission.updatedAt ?? undefined,
          p.permission.deletedAt ?? undefined
        );
      }),
      createdRole.updatedAt ?? undefined,
      createdRole.deletedAt ?? undefined
    );
  }

  async findById(id: string): Promise<Role | null> {
    const role = await prismaClient.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) return null;
    return new Role(
      role.id,
      role.name,
      role.createdAt,
      role.permissions.map((p) => {
        return new Permission(
          p.permission.id,
          p.permission.code,
          p.permission.name,
          p.permission.createdAt,
          p.permission.updatedAt ?? undefined,
          p.permission.deletedAt ?? undefined
        );
      }),
      role.updatedAt ?? undefined,
      role.deletedAt ?? undefined
    );
  }

  async update(id: string, role: Partial<Role>): Promise<Role> {
    const [_roleAfterReset, updatedRole] = await prismaClient.$transaction([
      prismaClient.role.update({
        where: { id },
        data: {
          permissions: {
            deleteMany: {},
          },
        },
      }),

      prismaClient.role.update({
        where: { id },
        data: {
          ...role,
          updatedAt: new Date(),
          permissions: role.permissions
            ? {
                create: role.permissions.map((p) => ({
                  permission: { connect: { id: p.id } },
                })),
              }
            : undefined,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      }),
    ]);

    return new Role(
      updatedRole.id,
      updatedRole.name,
      updatedRole.createdAt,
      updatedRole.permissions.map((p) => {
        return new Permission(
          p.permission.id,
          p.permission.code,
          p.permission.name,
          p.permission.createdAt,
          p.permission.updatedAt ?? undefined,
          p.permission.deletedAt ?? undefined
        );
      }),
      updatedRole.updatedAt ?? undefined,
      updatedRole.deletedAt ?? undefined
    );
  }
}
