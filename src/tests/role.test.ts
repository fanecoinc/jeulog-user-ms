import { Role } from '@/domain/entities/Role';
import broker from '@/infrastructure/broker/service-broker';

describe('Role Service E2E', () => {
  it('should create a role', async () => {
    const permissionIds = await broker
      .call('user.getPermissions')
      .then((permissions: any) => permissions.map((p: any) => p.id));

    const roleData = {
      name: 'Manager',
      permissionIds: permissionIds.slice(0, 2),
    };

    const response: any = await broker.call('user.createRole', roleData);
    expect(response).toHaveProperty('id');
    expect(response.name).toBe(roleData.name);
  });

  it('should get all roles', async () => {
    const roles: Role[] = await broker.call('user.getRoles');
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBeGreaterThan(0);
  });

  it('should get a role by ID', async () => {
    const roles: Role[] = await broker.call('user.getRoles');
    const roleId = roles[0].id;

    const role: Role = await broker.call('user.getRoleById', { id: roleId });
    expect(role).toHaveProperty('id', roleId);
    expect(role).toHaveProperty('name', 'Manager');
  });

  it('should update a role', async () => {
    const roles: Role[] = await broker.call('user.getRoles');
    const roleId = roles[0].id;

    const updatedRoleData = {
      id: roleId,
      name: 'Senior Manager',
    };

    const updatedRole: Role = await broker.call(
      'user.editRole',
      updatedRoleData
    );
    expect(updatedRole).toHaveProperty('id', roleId);
    expect(updatedRole.name).toBe(updatedRoleData.name);
  });
});
