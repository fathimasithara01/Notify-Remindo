"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  OrganizationSubscriptionStatus,
} from "../../types/organization-subscription.types";

interface OrganizationSubscriptionStatusBadgeProps {
  status: OrganizationSubscriptionStatus;
}

const statusConfig: Record<
  OrganizationSubscriptionStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  },

  pending: {
    label: "Pending",
    icon: Clock3,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
  },

  expired: {
    label: "Expired",
    icon: AlertCircle,
    className:
      "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50",
  },

  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
  },
};

export function OrganizationSubscriptionStatusBadge({
  status,
}: OrganizationSubscriptionStatusBadgeProps) {
  const config = statusConfig[status];

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      <Icon className="mr-1.5 h-3.5 w-3.5" />

      {config.label}
    </Badge>
  );
}