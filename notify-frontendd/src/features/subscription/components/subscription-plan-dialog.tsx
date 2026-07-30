"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SubscriptionPlanForm } from "./subscription-plan-form";

import { SubscriptionPlan } from "../types/subscription-plan.types";

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
  const isEdit = !!plan;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? "Edit Subscription Plan"
              : "Create Subscription Plan"}
          </DialogTitle>
        </DialogHeader>

        <SubscriptionPlanForm
          plan={plan}
          onSuccess={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}