"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { organizationSubscriptionApi } from "../../api/organization-subscription.api";

import { queryKeys } from "@/lib/query/query-keys";

interface CancelOrganizationSubscriptionVariables {
  id: string;
  organizationId: string;
  reason?: string;
}

export function useCancelOrganizationSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: CancelOrganizationSubscriptionVariables) =>
      organizationSubscriptionApi.cancel(
        id,
        reason
      ),

    onSuccess: (_data, variables) => {
      const { organizationId } = variables;

      // Refresh active subscription
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions
            .organizationSubscriptions
            .active(organizationId),
      });

      // Refresh subscription history
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions
            .organizationSubscriptions
            .byOrganization(
              organizationId
            ),
      });

      // Refresh all organization subscription queries
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions
            .organizationSubscriptions
            .all(),
      });
    },
  });
}