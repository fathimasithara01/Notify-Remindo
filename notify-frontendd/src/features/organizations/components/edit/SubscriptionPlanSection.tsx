// features/organizations/components/edit/SubscriptionPlanSection.tsx
"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

import { Organization } from "../../types/organization.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { ChangePlanDialog } from "../ChangePlanDialog";

interface SubscriptionPlanSectionProps {
  organization: Organization;
}

export function SubscriptionPlanSection({ organization }: SubscriptionPlanSectionProps) {
  const [changePlanOpen, setChangePlanOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Current plan for this organization.</CardDescription>
            </div>
          </div>

          <Button type="button" size="sm" variant="outline" onClick={() => setChangePlanOpen(true)}>
            Change Plan
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {organization.currentPlanName ? (
          <div className="rounded-lg border bg-primary/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current Plan
            </p>
            <p className="mt-1 font-semibold">{organization.currentPlanName}</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            No active plan assigned.
          </div>
        )}
      </CardContent>

      {/* <TableCell className="text-muted-foreground">
                              {org.currentPlanName ?? "—"}
                            </TableCell> */}

      <ChangePlanDialog
        organizationId={organization.id}
        currentPlanId={organization.currentPlanId ?? null}
        open={changePlanOpen}
        onOpenChange={setChangePlanOpen}
      />
    </Card>
  );
}