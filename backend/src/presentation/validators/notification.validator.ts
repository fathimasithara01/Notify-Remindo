import { z } from 'zod';

export const scheduleNotificationSchema = z.object({
  organizationId: z.string().min(1, 'organizationId is required'),
  referenceType: z.enum(['PDC_ISSUED', 'PDC_RECEIVED', 'HR_DOC']),
  referenceId: z.string().min(1, 'referenceId is required'),
  notifyBefore: z.number().int().nonnegative(),
  mode: z.enum(['whatsapp', 'email', 'in_app']),
  expiryDate: z.coerce.date(),
});

export const editNotificationSchema = z.object({
  notifyBefore: z.number().int().nonnegative().optional(),
  mode: z.enum(['whatsapp', 'email', 'in_app']).optional(),
  scheduledAt: z.coerce.date().optional(),
});