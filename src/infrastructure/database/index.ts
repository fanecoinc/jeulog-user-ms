import { PrismaClient } from '@prisma/client';
import { hashMiddleware } from './middlewares/hashMiddleware';

const prismaClient = new PrismaClient().$extends(hashMiddleware);

export { prismaClient };
