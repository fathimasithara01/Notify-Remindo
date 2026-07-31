"use client";

import { Loader2, AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useRemovePlanFeature } from "../../hooks/plan-features/use-remove-plan-feature";

import { PlanFeatureWithDetails } from "../../types/plan-feature.types";

interface RemovePlanFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  planId: string;

  planFeature:
    | PlanFeatureWithDetails
    | null;
}

export function RemovePlanFeatureDialog({
  open,
  onOpenChange,
  planId,
  planFeature,
}: RemovePlanFeatureDialogProps) {
  const removeMutation =
    useRemovePlanFeature();

  const handleRemove = () => {
    if (!planFeature) {
      return;
    }

    removeMutation.mutate(
      {
        planId,
        featureId:
          planFeature.featureId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleOpenChange = (
    value: boolean
  ) => {
    if (
      removeMutation.isPending
    ) {
      return;
    }

    onOpenChange(value);
  };

  const featureName =
    planFeature?.feature?.label ??
    "this feature";

  return (
    <AlertDialog
      open={open}
      onOpenChange={
        handleOpenChange
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-destructive/10
              "
            >
              <AlertTriangle
                className="
                  h-5
                  w-5
                  text-destructive
                "
              />
            </div>

            <AlertDialogTitle>
              Remove Feature?
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">
              {featureName}
            </span>{" "}
            from this subscription plan?
            This will not delete the feature
            itself.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={
              removeMutation.isPending
            }
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleRemove}
            disabled={
              removeMutation.isPending ||
              !planFeature
            }
            className="
              bg-destructive
              text-destructive-foreground
              hover:bg-destructive/90
            "
          >
            {removeMutation.isPending ? (
              <>
                <Loader2
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Removing...
              </>
            ) : (
              "Remove Feature"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}