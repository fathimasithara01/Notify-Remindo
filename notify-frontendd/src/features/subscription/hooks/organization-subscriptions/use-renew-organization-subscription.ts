"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { organizationSubscriptionApi } from "../../api/organization-subscription.api";

import { queryKeys } from "@/lib/query/query-keys";

interface RenewOrganizationSubscriptionVariables {
  id: string;
  organizationId: string;
}

export function useRenewOrganizationSubscription() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: RenewOrganizationSubscriptionVariables) =>
      organizationSubscriptionApi.renew(id),

    onSuccess: (
      _data,
      variables
    ) => {
      const {
        organizationId,
      } = variables;

      // Refresh active subscription
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions
            .organizationSubscriptions
            .active(
              organizationId
            ),
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