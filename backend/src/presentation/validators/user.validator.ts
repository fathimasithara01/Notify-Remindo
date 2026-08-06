import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  roleIds: z.array(z.string()).min(1, 'At least one role is required'),
});

export const editUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const assignRoleSchema = z.object({
  roleId: z.string().min(1, 'roleId is required'),
});

