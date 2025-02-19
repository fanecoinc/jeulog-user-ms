import { z } from 'zod';

const roleCreationSchema = z
  .object({
    name: z.string(),
    permissionIds: z.array(z.string().uuid('UUID inválido')),
  })
  .strict('Campo desconhecido inválido');

const roleEditSchema = z
  .object({
    name: z.string().optional(),
    permissionIds: z.array(z.string().uuid('UUID inválido')).optional(),
  })
  .strict('Campo desconhecido inválido');

export { roleCreationSchema, roleEditSchema };
