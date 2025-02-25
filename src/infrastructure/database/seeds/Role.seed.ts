import { prismaClient } from '..';
import { v4 as uuidv4 } from 'uuid';

export async function roleSeed(): Promise<void> {
  const adminRole = await prismaClient.role.findUnique({
    where: { name: 'Admin' },
  });

  const allPermissions = await prismaClient.permission.findMany();

  if (adminRole) {
    const [_roleAfterReset, _updatedRole] = await prismaClient.$transaction([
      prismaClient.role.update({
        where: { id: adminRole.id },
        data: {
          permissions: {
            deleteMany: {},
          },
        },
      }),

      prismaClient.role.update({
        where: { id: adminRole.id },
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
    name: 'Admin',
    permissions: {
      create: allPermissions.map((p) => ({
        permission: { connect: { id: p.id } },
      })),
    },
    createdAt: new Date(),
  };

  await prismaClient.role.create({ data });
}
