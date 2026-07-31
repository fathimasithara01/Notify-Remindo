"use client";

import { useState } from "react";
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

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useCancelOrganizationSubscription } from "../../hooks/organization-subscriptions/use-cancel-organization-subscription";

import {
  OrganizationSubscription,
} from "../../types/organization-subscription.types";

interface CancelOrganizationSubscriptionDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  subscription:
    | OrganizationSubscription
    | null;
}

export function CancelOrganizationSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
}: CancelOrganizationSubscriptionDialogProps) {
  const [reason, setReason] =
    useState("");

  const cancelMutation =
    useCancelOrganizationSubscription();

  const handleCancel = () => {
    if (!subscription) {
      return;
    }

    cancelMutation.mutate(
      {
        id: subscription.id,
        organizationId:
          subscription.organizationId,
        reason:
          reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          setReason("");
          onOpenChange(false);
        },
      }
    );
  };

  const handleOpenChange = (
    value: boolean
  ) => {
    if (cancelMutation.isPending) {
      return;
    }

    if (!value) {
      setReason("");
    }

    onOpenChange(value);
  };

  const planName =
    subscription?.plan?.name ??
    "this subscription";

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
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
              Cancel Subscription?
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription>
            Are you sure you want to cancel{" "}
            <span className="font-medium text-foreground">
              {planName}
            </span>
            ?
            <br />

            <span className="mt-2 block">
              This action will cancel the
              organization's active subscription.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Cancellation Reason */}

        <div className="space-y-2">
          <Label htmlFor="cancellation-reason">
            Cancellation Reason
            <span className="ml-1 text-muted-foreground">
              (optional)
            </span>
          </Label>

          <Textarea
            id="cancellation-reason"
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            placeholder="Enter the reason for cancellation..."
            maxLength={500}
            disabled={
              cancelMutation.isPending
            }
            rows={4}
          />

          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {reason.length}/500
            </span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={
              cancelMutation.isPending
            }
          >
            Keep Subscription
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleCancel}
            disabled={
              cancelMutation.isPending ||
              !subscription
            }
            className="
              bg-destructive
              text-destructive-foreground
              hover:bg-destructive/90
            "
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Cancelling...
              </>
            ) : (
              "Cancel Subscription"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}