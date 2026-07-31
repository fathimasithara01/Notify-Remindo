import { useQuery } from "@tanstack/react-query";
import { subscriptionPlanApi, SubscriptionPlanListParams } from "../../api/subscription-plan.api";
import { queryKeys } from "@/lib/query/query-keys";


export function useSubscriptionPlans(filters?: SubscriptionPlanListParams) {
    return useQuery({
        queryKey: queryKeys.subscriptions.plans.list(filters),
        queryFn: () => subscriptionPlanApi.list(filters),
        staleTime: 30 * 1000,
    });
}