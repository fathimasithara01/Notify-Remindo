"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface PlanFeatureSkeletonProps {
  rows?: number;
}

export function PlanFeatureSkeleton({
  rows = 5,
}: PlanFeatureSkeletonProps) {
  return (
    <div className="rounded-md border">
      <div className="w-full">

        {/* Header */}

        <div
          className="
            grid
            grid-cols-[2fr_1fr_1fr_80px]
            gap-4
            border-b
            px-4
            py-3
          "
        >
          <Skeleton className="h-4 w-24" />

          <Skeleton className="h-4 w-20" />

          <Skeleton className="h-4 w-16" />

          <Skeleton className="ml-auto h-4 w-16" />
        </div>

        {/* Rows */}

        {Array.from({ length: rows }).map(
          (_, index) => (
            <div
              key={index}
              className="
                grid
                grid-cols-[2fr_1fr_1fr_80px]
                items-center
                gap-4
                border-b
                px-4
                py-4
                last:border-b-0
              "
            >
              {/* Feature */}

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />

                <Skeleton className="h-3 w-48" />
              </div>

              {/* Value */}

              <Skeleton className="h-4 w-20" />

              {/* Type */}

              <Skeleton className="h-4 w-16" />

              {/* Actions */}

              <div className="flex justify-end">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}