import { Role } from '../domain/entities/Role';
import broker from '../infrastructure/broker/service-broker';
import { prismaClient } from '../infrastructure/database';

describe('Role Service E2E Tests', () => {
  beforeAll(async () => {
    await broker.start();
    await prismaClient.$connect();
  });

  afterAll(async () => {
    await broker.stop();
    await prismaClient.$disconnect();
  });

  it('should create a new role', async () => {
    const roleData = {
      name: 'Admin',
      permissionIds: [],
    };

    const createdRole: Role = await broker.call('user.createRole', roleData);

    expect(createdRole.name).toBe(roleData.name);
    expect(createdRole.permissions).toBeInstanceOf(Array);
    expect(createdRole.permissions.length).toBe(0);
  });
});
