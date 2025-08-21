import fs from 'fs-extra';
import path from 'path';

export default async function globalTeardown() {
  const testDbPath = path.resolve(
    __dirname,
    '../infrastructure/database/prisma/schema/test.db'
  );

  if (fs.existsSync(testDbPath)) {
    fs.removeSync(testDbPath);
  }
}
