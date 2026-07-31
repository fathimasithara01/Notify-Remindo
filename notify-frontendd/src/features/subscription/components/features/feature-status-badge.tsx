"use client";

import { Badge } from "@/components/ui/badge";

import {
  FeatureStatus,
}  from "../../types/feature.types";

interface FeatureStatusBadgeProps {
  status: FeatureStatus;
}

export function FeatureStatusBadge({
  status,
}: FeatureStatusBadgeProps) {

  switch (status) {

    case "active":
      return (
        <Badge
          className="
            bg-green-100
            text-green-700
            hover:bg-green-100
            border-green-200
          "
        >
          Active
        </Badge>
      );

    case "inactive":
      return (
        <Badge
          variant="secondary"
          className="
            bg-gray-100
            text-gray-700
            hover:bg-gray-100
          "
        >
          Inactive
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );

  }

}