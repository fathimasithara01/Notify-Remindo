import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionPlanApi } from "../../api/subscription-plan.api";
import { queryKeys, } from "@/lib/query/query-keys";
import { UpdateSubscriptionPlanInput, } from "../../types/subscription-plan.types";

interface UpdateSubscriptionPlanPayload {
    id: string;
    data: UpdateSubscriptionPlanInput;
}

export function useUpdateSubscriptionPlan() { //Custom hook create. so we use in component
    const queryClient = useQueryClient(); //queryClient React Query-yude cache manage cheyyan use cheyyunnu. like Cache update, Cache remove, Refetch trigger
    return useMutation({  
        mutationFn: (payload: UpdateSubscriptionPlanPayload) => {  //Actual API call happens here
            return subscriptionPlanApi.update(payload.id, payload.data);
        },
        onSuccess: (updatedPlan) => {  //API success aayal ee function execute aakum.

            //React Query cache-il existing detail data direct update cheyyunnu. API veendum call cheyyathe UI update aakum.
            queryClient.setQueryData(queryKeys.subscriptions.plans.detail(updatedPlan.id), updatedPlan);
         
            //Plan list cache stale(old) aakki, veendum backend-il ninn fetch cheyyan parayunnu.
            queryClient.invalidateQueries({
                queryKey: queryKeys.subscriptions.plans.all(),
            });
        },
    });
}