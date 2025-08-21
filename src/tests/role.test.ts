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

  it('should find a role by ID', async () => {
    const roleData = {
      name: 'User',
      permissionIds: [],
    };

    const createdRole: Role = await broker.call('user.createRole', roleData);
    const foundRole: Role = await broker.call('user.getRoleById', {
      id: createdRole.id,
    });

    expect(foundRole).toBeDefined();
    expect(foundRole.id).toBe(createdRole.id);
    expect(foundRole.name).toBe(roleData.name);
  });

  it('should retrieve all roles', async () => {
    const roles: Role[] = await broker.call('user.getRoles');
    expect(roles).toBeInstanceOf(Array);
  });

  it('should edit an existing role', async () => {
    const roleData = {
      name: 'Editor',
      permissionIds: [],
    };

    const createdRole: Role = await broker.call('user.createRole', roleData);

    const updatedData = {
      id: createdRole.id,
      name: 'Super Editor',
      permissionIds: [],
    };

    const updatedRole: Role = await broker.call('user.editRole', updatedData);

    expect(updatedRole).toBeDefined();
    expect(updatedRole.id).toBe(createdRole.id);
    expect(updatedRole.name).toBe(updatedData.name);
  });
});
