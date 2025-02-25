import { prismaClient } from '..';
import { v4 as uuidv4 } from 'uuid';

export async function userSeed(): Promise<void> {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const adminUser = await prismaClient.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL },
    });

    const adminRole = await prismaClient.role.findUnique({
      where: { name: 'Admin' },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!adminRole) {
      return;
    }

    const allPermissions = await prismaClient.permission.findMany();

    if (adminUser) {
      const [_userAfterReset, _updatedUser] = await prismaClient.$transaction([
        prismaClient.user.update({
          where: { id: adminUser.id },
          data: {
            permissions: {
              deleteMany: {},
            },
          },
        }),

        prismaClient.user.update({
          where: { id: adminUser.id },
          data: {
            updatedAt: new Date(),
            permissions: allPermissions
              ? {
                  create: allPermissions.map((p) => ({
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

      return;
    }

    const data = {
      id: uuidv4(),
      fullName: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      roleId: adminRole.id,
      createdAt: new Date(),
      active: true,
      permissions: {
        create: allPermissions.map((p) => ({
          permission: { connect: { id: p.id } },
        })),
      },
    };

    await prismaClient.user.create({ data });
  }
}
