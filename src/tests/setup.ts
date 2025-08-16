import { execSync } from 'child_process';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs-extra';

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
  // 1. Criar cópia temporária da pasta migrations
  fs.copySync(migrationsSource, migrationsTemp);

  // 2. Aplicar as migrations
  execSync(`npx prisma migrate deploy --schema=${schemaPath}`, {
    stdio: 'inherit',
  });
} finally {
  // 3. Apagar a pasta temporária
  fs.removeSync(migrationsTemp);
}
