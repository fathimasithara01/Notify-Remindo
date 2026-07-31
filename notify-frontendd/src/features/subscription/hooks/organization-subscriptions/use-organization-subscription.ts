"use client";

import { useQuery } from "@tanstack/react-query";

import { organizationSubscriptionApi } from "../../api/organization-subscription.api";

import { queryKeys } from "@/lib/query/query-keys";

export function useOrganizationSubscription(
  organizationId?: string
) {
  return useQuery({
    queryKey:
      organizationId
        ? queryKeys.subscriptions
            .organizationSubscriptions
            .active(organizationId)
        : [
            "subscriptions",
            "organization-subscriptions",
            "active",
            "disabled",
          ],

    queryFn: () => {
      if (!organizationId) {
        throw new Error(
          "Organization ID is required"
        );
      }

      return organizationSubscriptionApi.getActive(
        organizationId
      );
    },

    enabled: Boolean(organizationId),

    staleTime: 30 * 1000,
  });
}