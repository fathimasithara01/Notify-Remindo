import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
  permissionIds: z.array(z.string()).default([]),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const editRoleSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  permissionIds: z.array(z.string()).default([]),
});

export type EditRoleFormValues = z.infer<typeof editRoleSchema>;

export const addPermissionSchema = z.object({
  permissionId: z.string().min(1, 'Select a permission'),
});

export type AddPermissionFormValues = z.infer<typeof addPermissionSchema>;