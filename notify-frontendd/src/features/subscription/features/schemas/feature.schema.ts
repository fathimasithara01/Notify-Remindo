import { z } from "zod";

export const createFeatureSchema =
  z.object({

    key: z
      .string()
      .min(2, "Key is required")
      .max(100),

    label: z
      .string()
      .min(2, "Label is required")
      .max(100),

    description: z
      .string()
      .max(500)
      .optional(),

    category: z
      .string()
      .max(100)
      .optional(),

    dataType: z.enum([
      "boolean",
      "string",
      "number",
    ]),

    displayOrder: z
      .number()
      .min(0)
      .optional(),

    status: z.enum([
      "active",
      "inactive",
    ]),
  });

export const updateFeatureSchema =
  createFeatureSchema.partial();

export type CreateFeatureFormData =
  z.infer<
    typeof createFeatureSchema
  >;

export type UpdateFeatureFormData =
  z.infer<
    typeof updateFeatureSchema
  >;