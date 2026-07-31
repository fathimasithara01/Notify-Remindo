"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { organizationSubscriptionApi } from "../../api/organization-subscription.api";

import {
  CreateOrganizationSubscriptionInput,
} from "../../types/organization-subscription.types";

import { queryKeys } from "@/lib/query/query-keys";

export function useCreateOrganizationSubscription() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateOrganizationSubscriptionInput
    ) =>
      organizationSubscriptionApi.create(
        data
      ),

    onSuccess: (
      _data,
      variables
    ) => {
      const {
        organizationId,
      } = variables;

      /*
       * Refresh active subscription
       */
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions
            .organizationSubscriptions
            .active(
              organizationId
            ),
      });

      /*
       * Refresh subscription history
       */
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions
            .organizationSubscriptions
            .byOrganization(
              organizationId
            ),
      });

      /*
       * Refresh all organization
       * subscription related queries.
       */
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions
            .organizationSubscriptions
            .all(),
      });
    },
  });
}