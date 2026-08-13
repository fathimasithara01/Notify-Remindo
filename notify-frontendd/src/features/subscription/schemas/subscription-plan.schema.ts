import { z } from "zod";

const CURRENCIES = ["USD", "EUR", "INR"] as const;

export const createSubscriptionPlanSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional(),
  amountValue: z.coerce
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  currency: z.enum(CURRENCIES, {
    error: "Select a valid currency",
  }),
  userLimit: z.coerce
    .number({ error: "User limit must be a number" })
    .int("User limit must be a whole number")
    .positive("User limit must be greater than 0"),
  storageLimit: z.coerce
    .number({ error: "Storage limit must be a number" })
    .int("Storage limit must be a whole number")
    .positive("Storage limit must be greater than 0"),
  featureIds: z
    .array(z.string())
    .min(1, "Select at least one feature"),
});

export const updateSubscriptionPlanSchema = createSubscriptionPlanSchema.partial();

export type CreateSubscriptionPlanFormValues = z.infer<typeof createSubscriptionPlanSchema>;
export type UpdateSubscriptionPlanFormValues = z.infer<typeof updateSubscriptionPlanSchema>;
export type SubscriptionPlanFormInput = z.input<typeof createSubscriptionPlanSchema>;
