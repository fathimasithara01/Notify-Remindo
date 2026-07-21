import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userLimit: z.number().int().positive('userLimit must be a positive integer'),
  durationDays: z.number().int().positive('durationDays must be a positive integer'),
  price: z.number().nonnegative('price cannot be negative'),
  description: z.string().optional(),
  features: z
    .array(
      z.object({
        featureId: z.string(),
        featureValue: z.union([z.string(), z.boolean(), z.number()]),
      })
    )
    .optional(),
});

export const editPlanSchema = z.object({
  name: z.string().min(1).optional(),
  userLimit: z.number().int().positive().optional(),
  durationDays: z.number().int().positive().optional(),
  price: z.number().nonnegative().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const createFeatureSchema = z.object({
  key: z
    .string()
    .min(1, 'Key is required')
    .regex(/^[a-z0-9_]+$/, 'Key must be lowercase letters, numbers, or underscores'),
  label: z.string().min(1, 'Label is required'),
  dataType: z.enum(['boolean', 'number', 'string']),
});

export const editFeatureSchema = z.object({
  label: z.string().min(1).optional(),
  dataType: z.enum(['boolean', 'number', 'string']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const setPlanFeatureSchema = z.object({
  featureId: z.string().min(1, 'featureId is required'),
  featureValue: z.union([z.string(), z.boolean(), z.number()]),
});