import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  roleId: z.string().min(1, 'A role is required'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters').max(50),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'inactive']),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const changeRoleSchema = z.object({
  roleId: z.string().min(1, 'Select a role'),
});

export type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;