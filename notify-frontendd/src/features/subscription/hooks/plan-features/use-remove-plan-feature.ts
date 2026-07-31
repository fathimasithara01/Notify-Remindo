"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { planFeatureApi } from "../../api/plan-feature.api";

import { queryKeys } from "@/lib/query/query-keys";

export interface RemovePlanFeatureVariables {
  planId: string;
  featureId: string;
}

export function useRemovePlanFeature() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    RemovePlanFeatureVariables
  >({
    mutationFn: ({
      planId,
      featureId,
    }) =>
      planFeatureApi.remove(
        planId,
        featureId
      ),

    onSuccess: (
      _data,
      variables
    ) => {
      /*
       * Refresh the features assigned
       * to this specific plan.
       */
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions.planFeatures.byPlan(
            variables.planId
          ),
      });

      /*
       * Also invalidate the parent
       * plan-features cache.
       */
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions.planFeatures.all(),
      });
    },
  });
}