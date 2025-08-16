import broker from '@/infrastructure/broker/service-broker';
import { prismaClient } from '@/infrastructure/database';
import fs from 'fs';
import path from 'path';

const testDbPath = path.resolve(
  __dirname,
  '../infrastructure/database/prisma/schema/test.db'
);

const testDbJournalPath = path.resolve(
  __dirname,
  '../infrastructure/database/prisma/schema/test.db-journal'
);

describe('Role Service E2E', () => {
  beforeAll(async () => {
    await prismaClient.$connect();
    await broker.start();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
    await broker.stop();

    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    if (fs.existsSync(testDbJournalPath)) {
      fs.unlinkSync(testDbJournalPath);
    }
  });

  it('should create a role', async () => {
    const permissionIds = await broker
      .call('user.getPermissions')
      .then((permissions: any) => permissions.map((p: any) => p.id));

    const roleData = {
      name: 'Admin',
      permissionIds: permissionIds.slice(0, 2),
    };

    const response: any = await broker.call('user.createRole', roleData);
    expect(response).toHaveProperty('id');
    expect(response.name).toBe(roleData.name);
  });
});
