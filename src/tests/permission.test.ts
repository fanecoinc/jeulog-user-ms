import { Permission } from '@/domain/entities/Permission';
import broker from '../infrastructure/broker/service-broker';
import { prismaClient } from '../infrastructure/database';
import { permissionSeed } from '@/infrastructure/database/seeds/Permission.seed';

describe('Permission Service E2E Tests', () => {
  beforeAll(async () => {
    await broker.start();
    await prismaClient.$connect();
    await permissionSeed();
  });

  afterAll(async () => {
    await broker.stop();
    await prismaClient.$disconnect();
  });

  it('should retrieve all permissions', async () => {
    const permissions: Permission[] = await broker.call('user.getPermissions');
    expect(permissions).toBeInstanceOf(Array);
  });

  it('should find a permission by ID', async () => {
    const permissions: Permission[] = await broker.call('user.getPermissions');
    const permissionId = permissions[0].id;
    const foundPermission: Permission = await broker.call(
      'user.getPermissionById',
      {
        id: permissionId,
      }
    );
    expect(foundPermission).toBeDefined();
    expect(foundPermission.id).toBe(permissionId);
  });
});
