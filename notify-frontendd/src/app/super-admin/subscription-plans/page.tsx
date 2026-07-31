"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  SubscriptionPlanTable,
} from "@/features/subscription/components/subscription-plan-table";

import {
  SubscriptionPlanDialog,
} from "@/features/subscription/components/subscription-plan-dialog";

import {
  SubscriptionPlan,
} from "@/features/subscription/types/subscription-plan.types";

export default function SubscriptionPlansPage() {

  const [open, setOpen] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState<
      SubscriptionPlan | undefined
    >();

  const handleCreate = () => {

    setSelectedPlan(undefined);

    setOpen(true);

  };

  const handleEdit = (
    plan: SubscriptionPlan
  ) => {

    setSelectedPlan(plan);

    setOpen(true);

  };

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Subscription Plans
          </h1>

          <p className="text-muted-foreground">

            Manage pricing, billing intervals,
            and subscription plans available
            to organizations.

          </p>

        </div>

        <Button
          onClick={handleCreate}
        >

          <Plus className="mr-2 h-4 w-4" />

          Create Plan

        </Button>

      </div>

      {/* Table */}

      <SubscriptionPlanTable

        onCreate={handleCreate}

        onEdit={handleEdit}

      />

      {/* Dialog */}

      <SubscriptionPlanDialog

        open={open}

        onOpenChange={setOpen}

        plan={selectedPlan}

      />

    </div>

  );

}