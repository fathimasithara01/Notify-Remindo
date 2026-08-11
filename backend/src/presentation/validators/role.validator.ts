import { z } from 'zod';
import { ALL_PERMISSIONS } from '../../shared/constants/permissions.constant';

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50),
    description: z.string().trim().max(200).optional(),
    organizationId: z.string().optional(),
    permissionIds: z
      .array(z.enum(ALL_PERMISSIONS as [string, ...string[]]))
      .min(1, 'At least one permission required'),
  }),
});

export const editRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(50).optional(),
      description: z.string().trim().max(200).optional(),
      permissionIds: z.array(z.enum(ALL_PERMISSIONS as [string, ...string[]])).min(1).optional(),
      status: z.enum(['active', 'inactive']).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const listRolesQuerySchema = z.object({
  query: z.object({
    organizationId: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});