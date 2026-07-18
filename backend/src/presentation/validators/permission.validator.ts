import { z } from 'zod';

export const createPermissionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-z0-9_]+\.[a-z0-9_]+$/, 'Name must follow "module.action" format, e.g. "organization.block"'),
  module: z.string().min(1, 'Module is required'),
  description: z.string().optional(),
});

export const editPermissionSchema = z.object({
  module: z.string().min(1).optional(),
  description: z.string().optional(),
});