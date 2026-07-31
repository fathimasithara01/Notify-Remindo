"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Feature } from "../../features/types/feature.types";

import { FeatureForm } from "./feature-form";

interface FeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: Feature;
}

export function FeatureDialog({
  open,
  onOpenChange,
  feature,
}: FeatureDialogProps) {
  const isEdit = Boolean(feature);

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
            {isEdit
              ? "Edit Feature"
              : "Create Feature"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the feature configuration and settings."
              : "Create a new feature that can be assigned to subscription plans."}
          </DialogDescription>
        </DialogHeader>

        <FeatureForm
          feature={feature}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}