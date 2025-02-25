import { prismaClient } from '..';
import { v4 as uuidv4 } from 'uuid';

export async function roleSeed(): Promise<void> {
  const adminRole = await prismaClient.role.findUnique({
    where: { name: 'Admin' },
  });

  if (adminRole) {
    return;
  }

  const allPermissions = await prismaClient.permission.findMany();

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
