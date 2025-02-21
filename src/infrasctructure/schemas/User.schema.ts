import { z } from 'zod';

const userCreationSchema = z
  .object({
    email: z.string().email('Email inválido'),
    fullName: z.string(),
    password: z.string().min(8, 'A senha deve conter no mínimo 8 caracteres'),
    roleId: z.string().uuid('UUID inválido'),
    permissionIds: z.array(z.string().uuid('UUID inválido')),
    active: z.boolean().optional(),
  })
  .strict('Campo desconhecido inválido');

const userEditSchema = z
  .object({
    email: z.string().email('Email inválido').optional(),
    fullName: z.string().optional(),
    roleId: z.string().uuid('UUID inválido').optional(),
    permissionIds: z.array(z.string().uuid('UUID inválido')).optional(),
    active: z.boolean().optional(),
  })
  .strict('Campo desconhecido inválido');

const userResetPasswordSchema = z
  .object({
    password: z.string().min(8, 'A senha deve conter no mínimo 8 caracteres'),
  })
  .strict('Campo desconhecido inválido');

const userAuthSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict('Campo desconhecido inválido');

export {
  userCreationSchema,
  userEditSchema,
  userResetPasswordSchema,
  userAuthSchema,
};
