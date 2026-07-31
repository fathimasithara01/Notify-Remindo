"use client";

import { Badge } from "@/components/ui/badge";

interface Props {
  status: "draft" | "active" | "inactive";
}

export function SubscriptionPlanStatusBadge({
  status,
}: Props) {
  switch (status) {
    case "active":
      return (
        <Badge
          className="
            bg-green-100
            text-green-700
            border-green-200
            hover:bg-green-100
          "
        >
          Active
        </Badge>
      );

    case "inactive":
      return (
        <Badge
          variant="destructive"
        >
          Inactive
        </Badge>
      );

    default:
      return (
        <Badge
          variant="secondary"
        >
          Draft
        </Badge>
      );
  }
}