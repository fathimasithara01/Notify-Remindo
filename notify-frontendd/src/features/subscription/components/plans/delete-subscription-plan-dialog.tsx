"use client";

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

import { Loader2 } from "lucide-react";

import { SubscriptionPlan } from "../../types/subscription-plan.types";

interface DeleteSubscriptionPlanDialogProps {
  open: boolean;
  plan?: SubscriptionPlan | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteSubscriptionPlanDialog({
  open,
  plan,
  loading = false,
  onOpenChange,
  onConfirm,
}: DeleteSubscriptionPlanDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Subscription Plan
          </AlertDialogTitle>

          <AlertDialogDescription>

            Are you sure you want to delete

            <span className="font-semibold">
              {" "}
              "{plan?.name}"
            </span>

            ?

            <br />
            <br />

            This action cannot be undone.

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="
              bg-destructive
              hover:bg-destructive/90
            "
          >
            {loading && (
              <Loader2
                className="
                  mr-2
                  h-4
                  w-4
                  animate-spin
                "
              />
            )}

            {loading
              ? "Deleting..."
              : "Delete"}

          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
}