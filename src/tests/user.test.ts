import { Role } from '@/domain/entities/Role';
import { User } from '@/domain/entities/User';
import broker from '@/infrastructure/broker/service-broker';
import { prismaClient } from '@/infrastructure/database';

describe('User Service E2E', () => {
  let roleId: string;

  beforeAll(async () => {
    await prismaClient.$connect();
    await broker.start();

    const permissionIds = await broker
      .call('user.getPermissions')
      .then((permissions: any) => permissions.map((p: any) => p.id));

    const roleData = {
      name: 'Analyst',
      permissionIds: permissionIds.slice(0, 2),
    };

    const roleResponse: Role = await broker.call('user.createRole', roleData);
    roleId = roleResponse.id;
  });

  it('should create a user', async () => {
    const userData = {
      email: 'jhon@mail.com',
      fullName: 'Jhon Doe',
      password: 'password123',
      roleId: roleId,
      permissionIds: [],
      active: true,
    };

    const response: User = await broker.call('user.createUser', userData);
    expect(response).toHaveProperty('id');
    expect(response.email).toBe(userData.email);
    expect(response.fullName).toBe(userData.fullName);
    expect(response.role?.id).toBe(userData.roleId);
    expect(response.active).toBe(userData.active);
  });

  it('should get all users', async () => {
    const users: User[] = await broker.call('user.getUsers');
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it('should get a user by ID', async () => {
    const users: User[] = await broker.call('user.getUsers');
    const userId = users[0].id;

    const user: User = await broker.call('user.getUserById', { id: userId });
    expect(user).toHaveProperty('id', userId);
    expect(user).toHaveProperty('email');
  });

  it('should update a user', async () => {
    const users: User[] = await broker.call('user.getUsers');
    const userId = users[0].id;

    const updatedUserData = {
      id: userId,
      email: 'jhon2@mail.com',
      active: false,
    };

    const updatedUser: User = await broker.call(
      'user.editUser',
      updatedUserData
    );
    expect(updatedUser).toHaveProperty('id', userId);
    expect(updatedUser.email).toBe(updatedUserData.email);
    expect(updatedUser.active).toBe(updatedUserData.active);
  });

  it('should reset user password', async () => {
    const users: User[] = await broker.call('user.getUsers');
    const userId = users[0].id;

    const newPasswordData = {
      id: userId,
      password: 'newpassword123',
    };

    const updatedUser: User = await broker.call(
      'user.resetPassword',
      newPasswordData
    );
    expect(updatedUser).toHaveProperty('id', userId);
  });

  it('should authenticate a user', async () => {
    const authData = {
      email: 'jhon2@mail.com',
      password: 'newpassword123',
    };
    const authResponse = await broker.call('user.authUser', authData);
    expect(authResponse).toHaveProperty('token');
    expect(authResponse).toHaveProperty('expiresIn');
  });
});
