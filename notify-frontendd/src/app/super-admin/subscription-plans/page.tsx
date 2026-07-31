"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  SubscriptionPlanTable,
} from "@/features/subscription/components/plans/subscription-plan-table";

import {
  SubscriptionPlanDialog,
} from "@/features/subscription/components/plans/subscription-plan-dialog";

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