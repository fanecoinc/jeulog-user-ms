import { permissionSeed } from './Permission.seed';
import { userSeed } from './User.seed';
import { roleSeed } from './Role.seed';

export default async function executeSeeds(): Promise<void> {
  await permissionSeed();
  await roleSeed();
  await userSeed();
}
