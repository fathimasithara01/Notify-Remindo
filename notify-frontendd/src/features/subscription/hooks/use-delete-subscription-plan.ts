import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionPlanApi } from "../api/subscription-plan.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return subscriptionPlanApi.remove(id);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({  // Remove detail cache
        queryKey: queryKeys.subscriptions.plans.detail(id),
      });
      queryClient.invalidateQueries({       // Refresh list
        queryKey: queryKeys.subscriptions.plans.all(),
      });
    },
  });
}