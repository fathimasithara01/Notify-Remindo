import { z } from "zod";

export const createSubscriptionPlanSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  amountValue: z.number().nonnegative(),
  currency: z.enum(["USD", "EUR", "INR"]),
  userLimit: z.number().int().positive(),
  storageLimit: z.number().int().positive(),
  featureIds: z.array(z.string()).default([]),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const updateSubscriptionPlanSchema = createSubscriptionPlanSchema.partial();

export const listSubscriptionPlanQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(["active", "inactive"]).optional(),
  search: z.string().optional(),
});