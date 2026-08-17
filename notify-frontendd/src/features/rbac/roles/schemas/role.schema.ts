import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, 'Role name must be at least 2 characters').max(60, 'Role name must not exceed 60 characters'),
  description: z.string().trim().max(300, 'Description must not exceed 300 characters').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
  permissionIds: z.array(z.string()).min(1, 'Select at least one feature').default([])
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const editRoleSchema = z.object({
  name: z.string().trim().min(2, 'Role name must be at least 2 characters').max(60, 'Role name must not exceed 60 characters'),
  description: z.string().trim().max(300, 'Description must not exceed 300 characters').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
  permissionIds: z.array(z.string()).min(1, 'Select at least one feature').default([])
});

export type EditRoleFormValues = z.infer<typeof editRoleSchema>;

export const addPermissionSchema = z.object({
  permissionIds: z.array(z.string()).min(1, 'Select at least one feature').default([])
});

export type AddPermissionFormValues = z.infer<typeof addPermissionSchema>;