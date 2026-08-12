import { z } from 'zod';

export const createPlatformUserSchema = z.object({
  body: z
    .object({
      firstName: z.string().trim().min(2).max(50),
      lastName: z.string().trim().min(2).max(50),
      email: z.string().trim().email(),
      phone: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
        .optional()
        .or(z.literal('')),
      roleId: z.string().min(1, 'A role is required'),
      password: z
        .string()
        .min(8)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/),
      confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
});

export type CreateUserFormValues = z.infer<typeof createPlatformUserSchema>;

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