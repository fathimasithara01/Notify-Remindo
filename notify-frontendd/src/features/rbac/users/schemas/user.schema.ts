import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  organizationId: z.string().optional(),
  roleIds: z.array(z.string()).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  status: z.enum(['invited', 'active', 'inactive']),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const assignRoleSchema = z.object({
  roleId: z.string().min(1, 'Select a role'),
});

export type AssignRoleFormValues = z.infer<typeof assignRoleSchema>;