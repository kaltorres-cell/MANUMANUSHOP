import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'El título es requerido',
    }).min(3, 'El título debe tener al menos 3 caracteres'),
    description: z.string().optional(),
  }),
});
