import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9_-]+$/, 'Slug must be lowercase letters, numbers, hyphens, or underscores'),
  description: z.string().optional(),
});

export const editRoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const addPermissionSchema = z.object({
  permissionId: z.string().min(1, 'permissionId is required'),
});