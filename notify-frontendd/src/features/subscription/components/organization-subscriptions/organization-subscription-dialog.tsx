"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { OrganizationSubscriptionForm } from "./organization-subscription-form";

interface OrganizationSubscriptionDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  organizationId?: string;
}

export function OrganizationSubscriptionDialog({
  open,
  onOpenChange,
  organizationId,
}: OrganizationSubscriptionDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Assign Subscription
          </DialogTitle>

          <DialogDescription>
            Assign an active subscription plan
            to an organization.
          </DialogDescription>
        </DialogHeader>

        <OrganizationSubscriptionForm
          defaultOrganizationId={
            organizationId
          }
          onSuccess={() => {
            onOpenChange(false);
          }}
          onCancel={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}