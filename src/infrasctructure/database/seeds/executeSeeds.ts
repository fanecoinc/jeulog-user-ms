import { permissionSeed } from './Permission.seed';

export default async function executeSeeds(): Promise<void> {
  await permissionSeed();
}
