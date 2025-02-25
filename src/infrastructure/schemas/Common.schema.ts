import { z } from 'zod';

const uuidSchema = z.string().uuid('UUID inválido');

export { uuidSchema };
