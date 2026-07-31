import { z } from "zod";

export const createPlanFeatureSchema = z.object({
  featureId: z
    .string()
    .min(1, "Feature is required"),

  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
  ]),
});

export type CreatePlanFeatureFormData =
  z.infer<typeof createPlanFeatureSchema>;