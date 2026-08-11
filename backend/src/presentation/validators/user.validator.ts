import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters').max(50),
    lastName: z.string().trim().min(2, 'Last name must be at least 2 characters').max(50),
    email: z.string().trim().email('Invalid email address'),
    phone: z.string().optional(),
    roleId: z.string().min(1, 'A role is required'),
  }),
});

export const editUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      firstName: z.string().trim().min(2).max(50).optional(),
      lastName: z.string().trim().min(2).max(50).optional(),
      phone: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const assignRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    roleId: z.string().min(1, 'roleId is required'),
  }),
});