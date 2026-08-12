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
import { SubscriptionPlan } from "../../types/subscription-plan.types";
import { useDeleteSubscriptionPlan } from "../../hooks/plans/useSubscriptionPlan";
import { toast } from "sonner";

interface DeleteSubscriptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

export function DeleteSubscriptionPlanDialog({
  open,
  onOpenChange,
  plan,
}: DeleteSubscriptionPlanDialogProps) {
  const deletePlan = useDeleteSubscriptionPlan();

  const onConfirm = () => {
    if (!plan) return;
    deletePlan.mutate(plan.id, {
      onSuccess: () => {
        toast.success("Plan deleted");
        onOpenChange(false);
      },
      onError: () => toast.error("Failed to delete plan"),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete plan?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{plan?.title}". This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={deletePlan.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deletePlan.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}