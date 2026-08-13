"use client";

import { Badge } from "@/components/ui/badge";
import { SubscriptionPlanStatus } from "../../types/subscription-plan.types";

export function SubscriptionPlanStatusBadge({
  status,
}: {
  status: SubscriptionPlanStatus;
}) {
  const isActive = status === SubscriptionPlanStatus.ACTIVE;
  return (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}