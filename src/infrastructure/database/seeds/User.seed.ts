import { prismaClient } from '..';
import { v4 as uuidv4 } from 'uuid';

export async function userSeed(): Promise<void> {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const adminUser = await prismaClient.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (adminUser) {
      return;
    }

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
