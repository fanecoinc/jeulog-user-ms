import 'tsconfig-paths/register';
import { execSync } from 'child_process';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs-extra';

export default async function globalSetup() {
  config({ path: path.resolve(__dirname, '.env.test') });

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
    fs.ensureDirSync(migrationsTemp);
    fs.copySync(migrationsSource, migrationsTemp);

    execSync(`npx prisma migrate deploy --schema=${schemaPath}`, {
      stdio: 'inherit',
    });
  } finally {
    fs.removeSync(migrationsTemp);
  }
}
