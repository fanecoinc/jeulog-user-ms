import { Permission } from '@/domain/entities/Permission';
import broker from '@/infrastructure/broker/service-broker';
import { prismaClient } from '@/infrastructure/database';
import { permissionSeed } from '@/infrastructure/database/seeds/Permission.seed';

describe('Permission Service E2E', () => {
  beforeAll(async () => {
    await prismaClient.$connect();
    await broker.start();
    await permissionSeed();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
    await broker.stop();
  });

  it('should get all permissions', async () => {
    const permissions: Permission[] = await broker.call('user.getPermissions');
    expect(Array.isArray(permissions)).toBe(true);
    expect(permissions.length).toBeGreaterThan(0);
  });

  it('should get a permission by ID', async () => {
    const permissions: Permission[] = await broker.call('user.getPermissions');
    const permissionId = permissions[0].id;

    const permission: Permission = await broker.call('user.getPermissionById', {
      id: permissionId,
    });
    expect(permission).toHaveProperty('id', permissionId);
    expect(permission).toHaveProperty('name');
  });
});
