import { prismaClient } from '..';
import { Prisma } from '@prisma/client';
import { Permissions } from '../enums/Permission.enum';
import { v4 as uuidv4 } from 'uuid';

export async function permissionSeed(): Promise<void> {
  const permissions: Array<Record<string, string>> = Object.entries(
    Permissions
  ).map(([code, name]) => ({
    code,
    name,
  }));

  permissions.forEach(async (obj) => {
    const existingPermission = await prismaClient.permission.findUnique({
      where: { code: obj.code },
    });

    if (!existingPermission) {
      const data: Prisma.PermissionCreateInput = {
        id: uuidv4(),
        name: obj.name,
        code: obj.code,
        createdAt: new Date(),
      };

      await prismaClient.permission.create({ data });
    }
  });
}
