"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { planFeatureApi } from "../../api/plan-feature.api";

import { queryKeys } from "@/lib/query/query-keys";

import {
    CreatePlanFeatureInput,
    PlanFeature,
} from "../../types/plan-feature.types";

export interface AddPlanFeatureVariables {
    planId: string;
    data: Omit<CreatePlanFeatureInput, "planId">;
}

export function useAddPlanFeature() {
    const queryClient = useQueryClient();

    return useMutation<PlanFeature, Error, AddPlanFeatureVariables>({
        mutationFn: ({
            planId,
            data,
        }) =>
            planFeatureApi.add(
                planId,
                data
            ),

        onSuccess: (
            _data,
            variables
        ) => {
            /*
             * Refresh features assigned to this plan.
             */
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.subscriptions.planFeatures.byPlan(
                        variables.planId
                    ),
            });

            /*
             * Also refresh the general
             * plan-feature cache.
             */
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.subscriptions.planFeatures.all(),
            });
        },
    });
}