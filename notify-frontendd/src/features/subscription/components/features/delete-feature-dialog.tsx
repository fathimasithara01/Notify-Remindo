// components/features/delete-feature-dialog.tsx
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
import { Feature } from "../../types/feature.types";
import { useDeleteFeature } from "../../hooks/features/useFeature";
import { toast } from "sonner";

interface DeleteFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: Feature | null;
}

export function DeleteFeatureDialog({
  open,
  onOpenChange,
  feature,
}: DeleteFeatureDialogProps) {
  const deleteFeature = useDeleteFeature();

  const onConfirm = () => {
    if (!feature) return;
    deleteFeature.mutate(feature.id, {
      onSuccess: () => {
        toast.success("Feature deleted");
        onOpenChange(false);
      },
      onError: () => toast.error("Failed to delete feature"),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete feature?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{feature?.title}". This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={deleteFeature.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteFeature.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}