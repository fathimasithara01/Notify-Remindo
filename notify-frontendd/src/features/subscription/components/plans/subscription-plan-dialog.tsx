"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SubscriptionPlanForm } from "./subscription-plan-form";

import { SubscriptionPlan } from "../../types/subscription-plan.types";

interface SubscriptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: SubscriptionPlan;
}

export function SubscriptionPlanDialog({
  open,
  onOpenChange,
  plan,
}: SubscriptionPlanDialogProps) {

  const isEdit = Boolean(plan);

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-2xl
        "
      >

        <DialogHeader className="space-y-2">

          <DialogTitle className="text-xl">

            {isEdit
              ? "Edit Subscription Plan"
              : "Create Subscription Plan"}

          </DialogTitle>

          <DialogDescription>

            {isEdit
              ? "Update pricing, billing interval, status, and other plan settings."
              : "Create a new subscription plan that organizations can subscribe to."}

          </DialogDescription>

        </DialogHeader>

        <div className="pt-4">

          <SubscriptionPlanForm
            plan={plan}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />

        </div>

      </DialogContent>

    </Dialog>

  );

}