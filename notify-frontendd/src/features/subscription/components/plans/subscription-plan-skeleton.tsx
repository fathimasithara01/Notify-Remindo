"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionPlanSkeleton() {
  return (
    <div className="rounded-lg border bg-background">

      {/* Table Header */}

      <div className="border-b px-6 py-4">

        <div className="grid grid-cols-5 gap-6">

          <Skeleton className="h-5 w-28" />

          <Skeleton className="h-5 w-20" />

          <Skeleton className="h-5 w-24" />

          <Skeleton className="h-5 w-20" />

          <Skeleton className="ml-auto h-5 w-16" />

        </div>

      </div>

      {/* Rows */}

      {Array.from({ length: 6 }).map((_, index) => (

        <div
          key={index}
          className="
            grid
            grid-cols-5
            gap-6
            items-center
            px-6
            py-5
            border-b
            last:border-b-0
          "
        >

          {/* Plan */}

          <div>

            <Skeleton className="h-5 w-40" />

            <Skeleton className="mt-2 h-4 w-60" />

          </div>

          {/* Price */}

          <Skeleton className="h-5 w-24" />

          {/* Billing */}

          <Skeleton className="h-8 w-24 rounded-full" />

          {/* Status */}

          <Skeleton className="h-8 w-20 rounded-full" />

          {/* Actions */}

          <div className="flex justify-end">

            <Skeleton className="h-9 w-9 rounded-md" />

          </div>

        </div>

      ))}

    </div>
  );
}