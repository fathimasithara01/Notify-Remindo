import { useMutation,   useQueryClient} from "@tanstack/react-query";
import { subscriptionPlanApi } from "../../api/subscription-plan.api";
import { queryKeys } from "@/lib/query/query-keys";
import { CreateSubscriptionPlanInput } from "../../types/subscription-plan.types";

export function useCreateSubscriptionPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSubscriptionPlanInput) => subscriptionPlanApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.subscriptions.plans.all(),
            });
        },
    });
}