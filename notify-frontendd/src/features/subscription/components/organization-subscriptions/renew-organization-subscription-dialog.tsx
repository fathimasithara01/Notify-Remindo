"use client";

import {
  AlertCircle,
  Loader2,
} from "lucide-react";

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

import { useRenewOrganizationSubscription } from "../../hooks/organization-subscriptions/use-renew-organization-subscription";

import {
  OrganizationSubscription,
} from "../../types/organization-subscription.types";

interface RenewOrganizationSubscriptionDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  subscription:
    | OrganizationSubscription
    | null;
}

export function RenewOrganizationSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
}: RenewOrganizationSubscriptionDialogProps) {
  const renewMutation =
    useRenewOrganizationSubscription();

  const handleRenew = () => {
    if (!subscription) {
      return;
    }

    renewMutation.mutate(
      {
        id: subscription.id,
        organizationId:
          subscription.organizationId,
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
    if (renewMutation.isPending) {
      return;
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
                bg-primary/10
              "
            >
              <AlertCircle
                className="
                  h-5
                  w-5
                  text-primary
                "
              />
            </div>

            <AlertDialogTitle>
              Renew Subscription?
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription>
            Are you sure you want to renew{" "}
            <span className="font-medium text-foreground">
              {planName}
            </span>
            ?
            <br />
            <span className="mt-2 block">
              The subscription will be renewed
              according to its billing interval.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={
              renewMutation.isPending
            }
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleRenew}
            disabled={
              renewMutation.isPending ||
              !subscription
            }
          >
            {renewMutation.isPending ? (
              <>
                <Loader2
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Renewing...
              </>
            ) : (
              "Renew Subscription"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}