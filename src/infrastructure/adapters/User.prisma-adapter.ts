import { prismaClient } from '../database';
import { IUserRepository } from '@/domain/ports/User.repository';
import { Permission } from '@/domain/entities/Permission';
import { Role } from '@/domain/entities/Role';
import { User } from '@/domain/entities/User';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../database/config';
import jwt from 'jsonwebtoken';

export class PrismaUserRepository implements IUserRepository {
  private mapToUserEntity(instance: Record<string, any>): User {
    return new User(
      instance.id,
      instance.email,
      instance.fullName,
      instance.password,
      instance.active,
      instance.createdAt,
      instance.roleId,
      new Role(
        instance.role.id,
        instance.role.name,
        instance.role.createdAt,
        [],
        instance.role.updatedAt ?? undefined,
        instance.role.deletedAt ?? undefined
      ),
      instance.permissions.map(
        (p: any) =>
          new Permission(
            p.permission.id,
            p.permission.code,
            p.permission.name,
            p.permission.createdAt,
            p.permission.updatedAt ?? undefined,
            p.permission.deletedAt ?? undefined
          )
      ),
      instance.updatedAt ?? undefined,
      instance.deletedAt ?? undefined
    );
  }

  async getAll(): Promise<User[]> {
    const users = await prismaClient.user.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        role: true,
      },
    });

    return users.map(this.mapToUserEntity);
  }

  async create(user: User): Promise<User> {
    const createdUser = await prismaClient.user.create({
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        active: user.active,
        createdAt: user.createdAt,
        roleId: user.roleId,
        permissions: {
          create: user.permissions.map((p) => ({
            permission: { connect: { id: p.id } },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        role: true,
      },
    });

    return this.mapToUserEntity(createdUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        role: true,
      },
    });

    if (!user) return null;
    return this.mapToUserEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: { email },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        role: true,
      },
    });

    if (!user) return null;
    return this.mapToUserEntity(user);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const [_userAfterReset, updatedUser] = await prismaClient.$transaction([
      prismaClient.user.update({
        where: { id },
        data: {
          permissions: {
            deleteMany: {},
          },
        },
      }),

      prismaClient.user.update({
        where: { id },
        data: {
          email: user.email,
          fullName: user.fullName,
          password: user.password,
          active: user.active,
          roleId: user.roleId,
          updatedAt: new Date(),
          permissions: user.permissions
            ? {
                create: user.permissions.map((p) => ({
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
          role: true,
        },
      }),
    ]);

    return this.mapToUserEntity(updatedUser);
  }

  async authenticate(
    user: Partial<User>
  ): Promise<Record<string, string | number> | null> {
    const authUser = await prismaClient.user.findUnique({
      where: { email: user.email },
      include: {
        permissions: {
          select: {
            permission: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });

    if (!authUser) {
      return null;
    }

    const validate = await bcrypt.compare(
      user.password ?? '',
      authUser.password
    );

    if (!validate) {
      return null;
    }

    let { password, permissions, ...userData }: any = authUser;

    permissions =
      authUser?.permissions.map((p: any) => p.permission.code) || [];
    const token = jwt.sign(
      { user: { data: userData, permissions: permissions } },
      JWT_SECRET,
      {
        expiresIn: '5h',
      }
    );

    return {
      message: 'authenticated!',
      token: token,
      expiresIn: 18000,
    };
  }
}
