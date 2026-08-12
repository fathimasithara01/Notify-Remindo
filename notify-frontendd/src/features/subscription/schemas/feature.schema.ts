import { z } from "zod";
import { FeatureStatus } from "../types/feature.types";

export const createFeatureSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional(),
  category: z
    .string()
    .max(50, "Category must be under 50 characters")
    .optional(),
});

export const updateFeatureSchema = createFeatureSchema.partial();

export const featureStatusSchema = z.enum([
  FeatureStatus.ACTIVE,
  FeatureStatus.INACTIVE,
]);

export type CreateFeatureFormValues = z.infer<typeof createFeatureSchema>;
export type UpdateFeatureFormValues = z.infer<typeof updateFeatureSchema>;