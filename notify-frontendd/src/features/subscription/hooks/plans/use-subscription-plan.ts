import { useQuery } from "@tanstack/react-query";
import { subscriptionPlanApi } from "../../api/subscription-plan.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useSubscriptionPlan(id?: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.plans.detail(id ?? ""),
    queryFn: () => subscriptionPlanApi.findById(id as string),
    enabled: Boolean(id),  //id undenkil mathram query run cheyyuka.Athukond runtime errors avoid cheyyan ithoru safe pattern aanu.
    staleTime: 30 * 1000,
  });
}