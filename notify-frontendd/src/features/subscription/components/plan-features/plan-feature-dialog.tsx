"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PlanFeatureForm } from "./plan-feature-form";

interface PlanFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
}

export function PlanFeatureDialog({
  open,
  onOpenChange,
  planId,
}: PlanFeatureDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-xl
        "
      >
        <DialogHeader>
          <DialogTitle>
            Add Feature to Plan
          </DialogTitle>

          <DialogDescription>
            Select a feature and configure
            its value for this subscription plan.
          </DialogDescription>
        </DialogHeader>

        <PlanFeatureForm
          planId={planId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}