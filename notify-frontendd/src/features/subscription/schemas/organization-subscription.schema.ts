import { z } from "zod";

/**
 * Create Organization Subscription
 */
export const createOrganizationSubscriptionSchema =
  z.object({
    organizationId: z
      .string()
      .min(
        1,
        "Organization is required"
      ),

    planId: z
      .string()
      .min(
        1,
        "Subscription plan is required"
      ),
  });

export type CreateOrganizationSubscriptionFormData =
  z.infer<
    typeof createOrganizationSubscriptionSchema
  >;


/**
 * Cancel Organization Subscription
 */
export const cancelOrganizationSubscriptionSchema =
  z.object({
    reason: z
      .string()
      .trim()
      .max(
        500,
        "Cancellation reason cannot exceed 500 characters"
      )
      .optional(),
  });

export type CancelOrganizationSubscriptionFormData =
  z.infer<
    typeof cancelOrganizationSubscriptionSchema
  >;