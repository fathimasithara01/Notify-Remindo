"use client";

import { useState } from "react";
import { Plus, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  OrganizationSubscriptionDialog,
} from "@/features/subscription/components/organization-subscriptions/organization-subscription-dialog";

import {
  OrganizationSubscriptionTable,
} from "@/features/subscription/components/organization-subscriptions/organization-subscription-table";

import { useSearchParams } from "next/navigation";

export default function OrganizationSubscriptionsPage() {
  const searchParams =
    useSearchParams();

  const organizationId =
    searchParams.get(
      "organizationId"
    );

  const [
    createDialogOpen,
    setCreateDialogOpen,
  ] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Organization Subscriptions
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage subscription assignments,
            renewals, cancellations, and
            subscription history.
          </p>
        </div>

        <Button
          onClick={() =>
            setCreateDialogOpen(true)
          }
        >
          <Plus className="mr-2 h-4 w-4" />

          Assign Subscription
        </Button>
      </div>

      {/* Organization Requirement */}

      {!organizationId ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Select an Organization
            </CardTitle>

            <CardDescription>
              An organization is required to
              view its subscription history.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Open this page with an organization
              ID, for example:
            </p>

            <code
              className="
                mt-2
                block
                rounded-md
                bg-muted
                p-3
                text-sm
              "
            >
              ?organizationId=ORGANIZATION_ID
            </code>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <OrganizationSubscriptionTable
              organizationId={
                organizationId
              }
              onCreateSubscription={() =>
                setCreateDialogOpen(true)
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Create Subscription Dialog */}

      <OrganizationSubscriptionDialog
        open={createDialogOpen}
        onOpenChange={
          setCreateDialogOpen
        }
        organizationId={
          organizationId ?? undefined
        }
      />
    </div>
  );
}