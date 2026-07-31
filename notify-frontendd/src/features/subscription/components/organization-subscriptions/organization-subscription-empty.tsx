"use client";

import {
  CreditCard,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface OrganizationSubscriptionEmptyProps {
  onCreateSubscription?: () => void;
}

export function OrganizationSubscriptionEmpty({
  onCreateSubscription,
}: OrganizationSubscriptionEmptyProps) {
  return (
    <div
      className="
        flex
        min-h-[280px]
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-dashed
        px-6
        py-10
        text-center
      "
    >
      {/* Icon */}

      <div
        className="
          mb-4
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-muted
        "
      >
        <CreditCard
          className="
            h-6
            w-6
            text-muted-foreground
          "
        />
      </div>

      {/* Title */}

      <h3 className="text-base font-semibold">
        No subscriptions found
      </h3>

      {/* Description */}

      <p
        className="
          mt-1
          max-w-md
          text-sm
          text-muted-foreground
        "
      >
        This organization does not have any
        subscription history yet. Assign a
        subscription plan to get started.
      </p>

      {/* Action */}

      {onCreateSubscription && (
        <Button
          className="mt-5"
          onClick={onCreateSubscription}
        >
          <Plus className="mr-2 h-4 w-4" />

          Assign Subscription
        </Button>
      )}
    </div>
  );
}