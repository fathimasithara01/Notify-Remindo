import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(60)
    .regex(slugRegex, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().trim().max(300).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const editRoleSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(60)
    .regex(slugRegex, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().trim().max(300).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
});

export type EditRoleFormValues = z.infer<typeof editRoleSchema>;

export const addPermissionSchema = z.object({
  permissionId: z.string().min(1, 'Select a permission'),
});

export type AddPermissionFormValues = z.infer<typeof addPermissionSchema>;