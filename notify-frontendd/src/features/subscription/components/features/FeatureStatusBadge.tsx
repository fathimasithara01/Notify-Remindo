"use client";

import { FeatureStatus } from "../../types/feature.types";

interface FeatureStatusBadgeProps {
  status: FeatureStatus;
}

const STYLES: Record<FeatureStatus, string> = {
  [FeatureStatus.ACTIVE]: "bg-green-100 text-green-700",
  [FeatureStatus.INACTIVE]: "bg-gray-100 text-gray-600",
};

const LABELS: Record<FeatureStatus, string> = {
  [FeatureStatus.ACTIVE]: "Active",
  [FeatureStatus.INACTIVE]: "Inactive",
};

export function FeatureStatusBadge({ status }: FeatureStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}