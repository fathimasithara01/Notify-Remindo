"use client";

import { useParams } from "next/navigation";
// import { SubscriptionDetail } from "@/features/subscription-plans/components/SubscriptionDetail";
import { useSubscriptionPlan } from "@/features/subscription/hooks/plans/use-subscription-plan";
import { SubscriptionDetail } from "@/features/subscription/components/plans/SubscriptionDetail";

export default function SubscriptionPlanPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: plan,
    isLoading,
    isError,
  } = useSubscriptionPlan(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !plan) {
    return <div>Subscription plan not found.</div>;
  }

  return <SubscriptionDetail plan={plan} />;
}