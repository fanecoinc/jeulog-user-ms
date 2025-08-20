import { execSync } from 'child_process';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs-extra';

config({ path: path.resolve(__dirname, '.env.test') });

const testDbPath = path.resolve(
  __dirname,
  '../infrastructure/database/prisma/schema/test.db'
);

const testDbJournalPath = path.resolve(
  __dirname,
  '../infrastructure/database/prisma/schema/test.db-journal'
);

const schemaPath = path.resolve(
  __dirname,
  '../infrastructure/database/prisma/schema/schema.prisma'
);

const migrationsSource = path.resolve(
  __dirname,
  '../infrastructure/database/prisma/migrations'
);

const migrationsTemp = path.resolve(
  __dirname,
  '../infrastructure/database/prisma/schema/migrations'
);

try {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  if (fs.existsSync(testDbJournalPath)) {
    fs.unlinkSync(testDbJournalPath);
  }

  fs.copySync(migrationsSource, migrationsTemp);

  execSync(`npx prisma migrate deploy --schema=${schemaPath}`, {
    stdio: 'inherit',
  });
} finally {
  fs.removeSync(migrationsTemp);
}
