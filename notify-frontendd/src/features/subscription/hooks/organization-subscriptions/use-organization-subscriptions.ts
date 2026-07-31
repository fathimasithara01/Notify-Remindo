"use client";

import { useQuery } from "@tanstack/react-query";

import { organizationSubscriptionApi } from "../../api/organization-subscription.api";

import {
  OrganizationSubscriptionHistoryParams,
} from "../../types/organization-subscription.types";

import { queryKeys } from "@/lib/query/query-keys";

export function useOrganizationSubscriptions(
  params: OrganizationSubscriptionHistoryParams
) {
  const {
    organizationId,
    page = 1,
    limit = 10,
    status = "all",
  } = params;

  return useQuery({
    queryKey:
      queryKeys.subscriptions.organizationSubscriptions.byOrganization(
        organizationId
      ),

    queryFn: () =>
      organizationSubscriptionApi.list({
        organizationId,
        page,
        limit,
        status,
      }),

    enabled: Boolean(organizationId),

    staleTime: 30 * 1000,
  });
}