"use client";

import { CreditCard, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubscriptionPlanEmptyProps {
  onCreate: () => void;
}

export function SubscriptionPlanEmpty({
  onCreate,
}: SubscriptionPlanEmptyProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-dashed
        bg-muted/20
        px-8
        py-20
        text-center
      "
    >
      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-primary/10
        "
      >
        <CreditCard
          className="
            h-8
            w-8
            text-primary
          "
        />
      </div>

      <h3
        className="
          mt-6
          text-xl
          font-semibold
        "
      >
        No Subscription Plans
      </h3>

      <p
        className="
          mt-2
          max-w-md
          text-sm
          text-muted-foreground
        "
      >
        You haven't created any subscription plans yet.
        Create your first subscription plan to start assigning
        plans to organizations.
      </p>

      <Button
        className="mt-8"
        onClick={onCreate}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Subscription Plan
      </Button>
    </div>
  );
}