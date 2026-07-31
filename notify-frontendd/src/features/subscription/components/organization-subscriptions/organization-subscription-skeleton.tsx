"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface OrganizationSubscriptionSkeletonProps {
  rows?: number;
}

export function OrganizationSubscriptionSkeleton({
  rows = 5,
}: OrganizationSubscriptionSkeletonProps) {
  return (
    <div className="rounded-lg border">
      {/* Table Header */}

      <div
        className="
          grid
          grid-cols-[2fr_1.2fr_1fr_1.2fr_1.2fr_80px]
          gap-4
          border-b
          px-4
          py-3
        "
      >
        <Skeleton className="h-4 w-28" />

        <Skeleton className="h-4 w-20" />

        <Skeleton className="h-4 w-16" />

        <Skeleton className="h-4 w-24" />

        <Skeleton className="h-4 w-20" />

        <Skeleton className="ml-auto h-4 w-16" />
      </div>

      {/* Table Rows */}

      {Array.from({ length: rows }).map(
        (_, index) => (
          <div
            key={index}
            className="
              grid
              grid-cols-[2fr_1.2fr_1fr_1.2fr_1.2fr_80px]
              items-center
              gap-4
              border-b
              px-4
              py-4
              last:border-b-0
            "
          >
            {/* Plan */}

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />

              <Skeleton className="h-3 w-44" />
            </div>

            {/* Price */}

            <Skeleton className="h-4 w-20" />

            {/* Status */}

            <Skeleton className="h-6 w-20 rounded-full" />

            {/* Start Date */}

            <Skeleton className="h-4 w-24" />

            {/* End Date */}

            <Skeleton className="h-4 w-24" />

            {/* Actions */}

            <div className="flex justify-end">
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        )
      )}
    </div>
  );
}