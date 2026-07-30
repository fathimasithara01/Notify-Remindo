import { z } from "zod";

export const createSubscriptionPlanSchema = z.object({
  name: z
    .string()
    .min(2, "Plan name must contain at least 2 characters")
    .max(100, "Plan name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  priceInMinorUnit: z.coerce
    .number()
    .min(0, "Price cannot be negative"),

  currency: z.enum([
    "USD",
    "EUR",
    "INR",
  ]),

  billingInterval: z.enum([
    "weekly",
    "monthly",
    "yearly",
  ]),

  trialDays: z
    .number()
    .min(0, "Trial days cannot be negative")
    .optional(),

  status: z
    .enum([
      "draft",
      "active",
      "inactive",
    ])
    .default("draft"),

});

export const updateSubscriptionPlanSchema =
  createSubscriptionPlanSchema.partial();

export type CreateSubscriptionPlanFormData =
  z.infer<typeof createSubscriptionPlanSchema>;

export type UpdateSubscriptionPlanFormData =
  z.infer<typeof updateSubscriptionPlanSchema>;