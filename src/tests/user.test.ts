import { Role } from '@/domain/entities/Role';
import broker from '../infrastructure/broker/service-broker';
import { prismaClient } from '../infrastructure/database';
import { User } from '@/domain/entities/User';
import { CreateUserDTO, UpdateUserDTO } from '@/application/dtos/User.dto';

describe('User Service E2E Tests', () => {
  beforeAll(async () => {
    await broker.start();
    await prismaClient.$connect();
  });

  afterAll(async () => {
    await broker.stop();
    await prismaClient.$disconnect();
  });

  it('should retrieve all users', async () => {
    const users: User[] = await broker.call('user.getUsers');
    expect(users).toBeInstanceOf(Array);
  });

  it('should create a new user', async () => {
    const createdRole: Role = await broker.call('user.createRole', {
      name: 'Test Role',
      permissionIds: [],
    });

    const newUser: CreateUserDTO = {
      email: 'test@user.com',
      fullName: 'Test User',
      password: 'password123',
      roleId: createdRole.id,
      permissionIds: [],
      active: true,
    };

    const createdUser: User = await broker.call('user.createUser', newUser);
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.fullName).toBe(newUser.fullName);
    expect(createdUser.role?.id).toBe(newUser.roleId);
    expect(createdUser.active).toBe(newUser.active);
  });

  it('should find a user by ID', async () => {
    const users: User[] = await broker.call('user.getUsers');
    const userId = users[0].id;
    const foundUser: User = await broker.call('user.getUserById', {
      id: userId,
    });
    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(userId);
  });

  it('should edit an existing user', async () => {
    const users: User[] = await broker.call('user.getUsers');
    const userId = users[0].id;

    const updatedUser: UpdateUserDTO = {
      email: 'test2@user.com',
    };
    const editedUser: User = await broker.call('user.editUser', {
      id: userId,
      ...updatedUser,
    });
    expect(editedUser).toBeDefined();
    expect(editedUser.id).toBe(userId);
    expect(editedUser.email).toBe(updatedUser.email);
  });

  it('should reset user password', async () => {
    const users: User[] = await broker.call('user.getUsers');
    const userId = users[0].id;

    const resetPasswordDTO = {
      password: 'newpassword123',
    };
    const updatedUser: User = await broker.call('user.resetPassword', {
      id: userId,
      ...resetPasswordDTO,
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser.id).toBe(userId);
  });

  it('should authenticate a user', async () => {
    const authDTO = {
      email: 'test2@user.com',
      password: 'newpassword123',
    };
    const authenticatedUser: any = await broker.call('user.authUser', authDTO);
    expect(authenticatedUser).toBeDefined();
    expect(authenticatedUser.token).toBeDefined();
    expect(authenticatedUser.expiresIn).toBeDefined();
  });
});
