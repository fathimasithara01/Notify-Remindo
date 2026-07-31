"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Loader2, Trash2 } from "lucide-react";

import { Feature } from "../types/feature.types";

import {
  useDeleteFeature,
} from "../hooks/use-delete-feature";

interface DeleteFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: Feature;
}

export function DeleteFeatureDialog({
  open,
  onOpenChange,
  feature,
}: DeleteFeatureDialogProps) {

  const deleteMutation =
    useDeleteFeature();

  const handleDelete = () => {

    if (!feature) return;

    deleteMutation.mutate(
      feature.id,
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );

  };

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle className="flex items-center gap-2">

            <Trash2 className="h-5 w-5 text-destructive" />

            Delete Feature

          </DialogTitle>

          <DialogDescription>

            This action cannot be undone.

            <br />

            Are you sure you want to delete

            <span className="font-semibold">
              {" "}
              {feature?.label}
            </span>

            ?

          </DialogDescription>

        </DialogHeader>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >

            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Feature
              </>
            )}

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}