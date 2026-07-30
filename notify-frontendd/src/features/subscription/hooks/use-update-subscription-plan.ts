import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    subscriptionPlanApi,
} from "../api/subscription-plan.api";
import { queryKeys, } from "@/lib/query/query-keys";
import { UpdateSubscriptionPlanInput, } from "../types/subscription-plan.types";

interface UpdateSubscriptionPlanPayload {
    id: string;
    data: UpdateSubscriptionPlanInput;
}

export function useUpdateSubscriptionPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:
            (payload: UpdateSubscriptionPlanPayload) => {
                return subscriptionPlanApi.update(
                    payload.id,
                    payload.data
                );
            },
        onSuccess: (updatedPlan) => {
            // Update single plan cache
            queryClient.setQueryData(queryKeys.subscriptions.plans.detail(updatedPlan.id), updatedPlan);
            // Refresh plan list
            queryClient.invalidateQueries({
                queryKey: queryKeys.subscriptions.plans.all(),
            });
        },
    });
}