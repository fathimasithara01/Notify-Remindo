import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: z.string().min(1, 'roleId is required'),
});

export const editUserSchema = z.object({
  name: z.string().min(1).optional(),
  roleId: z.string().min(1).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});