"use client";

import { useQuery } from "@tanstack/react-query";

import { planFeatureApi } from "../../api/plan-feature.api";

import { queryKeys } from "@/lib/query/query-keys";

export function usePlanFeatures(
  planId: string,
  enabled = true
) {
  return useQuery({
    queryKey:
      queryKeys.subscriptions.planFeatures.byPlan(
        planId
      ),

    queryFn: () =>
      planFeatureApi.list(planId),

    enabled:
      enabled &&
      Boolean(planId),

    staleTime: 30 * 1000,
  });
}