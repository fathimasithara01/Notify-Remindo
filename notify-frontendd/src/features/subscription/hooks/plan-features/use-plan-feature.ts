"use client";

import { useQuery } from "@tanstack/react-query";

import { planFeatureApi } from "../../api/plan-feature.api";

import { queryKeys } from "@/lib/query/query-keys";

export function usePlanFeature(
  planId: string,
  featureId: string,
  enabled = true
) {
  return useQuery({
    queryKey: [
      ...queryKeys.subscriptions.planFeatures.byPlan(
        planId
      ),
      featureId,
    ] as const,

    queryFn: async () => {
      const response =
        await planFeatureApi.list(planId);

      return response.items.find(
        (planFeature) =>
          planFeature.featureId === featureId
      ) ?? null;
    },

    enabled:
      enabled &&
      Boolean(planId) &&
      Boolean(featureId),

    staleTime: 30 * 1000,
  });
}