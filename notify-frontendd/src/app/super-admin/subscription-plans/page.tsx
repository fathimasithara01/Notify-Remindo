// src/app/admin/subscription-plans/page.tsx

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

// import {
//   SubscriptionPlanTable,
// } from "@/features/subscription/components/subscription-plan-table";

import { SubscriptionPlanTable} from "@/features/subscription/components/subscription-plan-table" 
import {SubscriptionPlanDialog} from "@/features/subscription/components/subscription-plan-dialog";

import {
  SubscriptionPlan,
} from "@/features/subscription/types/subscription-plan.types";



export default function SubscriptionPlansPage() {

  const [open, setOpen] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan>();



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

    <div className="space-y-6 p-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Subscription Plans
          </h1>

          <p className="text-muted-foreground">
            Create, update and manage subscription plans.
          </p>

        </div>

        <Button
          onClick={handleCreate}
        >
          Add Plan
        </Button>

      </div>



      <SubscriptionPlanTable
        onEdit={handleEdit}
      />



      <SubscriptionPlanDialog
        open={open}
        onOpenChange={setOpen}
        plan={selectedPlan}
      />

    </div>

  );

}