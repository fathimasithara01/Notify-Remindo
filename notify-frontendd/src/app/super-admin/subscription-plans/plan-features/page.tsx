"use client";

import { useState } from "react";
import { Layers3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSubscriptionPlans } from "@/features/subscription/hooks/plans/use-subscription-plans";

import { PlanFeatureTable } from "@/features/subscription/components/plan-features/plan-feature-table";

import { PlanFeatureDialog } from "@/features/subscription/components/plan-features/plan-feature-dialog";

import { LoadingState } from "@/components/common/LoadingState";

export default function PlanFeaturesPage() {
  const [selectedPlanId, setSelectedPlanId] =
    useState<string>("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const {
    data: plansData,
    isLoading: plansLoading,
    isError: plansError,
  } = useSubscriptionPlans({
    page: 1,
    limit: 100,
    status: "active",
  });

  const plans = plansData?.items ?? [];

  const selectedPlan = plans.find(
    (plan) =>
      plan.id === selectedPlanId
  );

  /*
   * Select the first active plan automatically
   * when plans are loaded.
   */
  if (
    !plansLoading &&
    !selectedPlanId &&
    plans.length > 0
  ) {
    setSelectedPlanId(plans[0].id);
  }

  if (plansLoading) {
    return <LoadingState />;
  }

  if (plansError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Plan Features
          </h1>

          <p className="text-muted-foreground">
            Manage features assigned to subscription
            plans.
          </p>
        </div>

        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium text-destructive">
              Failed to load subscription plans.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div>
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              bg-primary/10
            "
          >
            <Layers3 className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Plan Features
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage features assigned to subscription
              plans.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Selector */}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Select Subscription Plan
          </CardTitle>
        </CardHeader>

        <CardContent>
          {plans.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="font-medium">
                No active subscription plans
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create an active subscription plan
                before assigning features.
              </p>
            </div>
          ) : (
            <div className="max-w-md space-y-2">
              <Select
                value={selectedPlanId}
                onValueChange={setSelectedPlanId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>

                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem
                      key={plan.id}
                      value={plan.id}
                    >
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPlan && (
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.description ||
                    "Manage features available in this plan."}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Features */}

      {selectedPlanId && (
        <Card>
          <CardHeader>
            <CardTitle className="sr-only">
              Assigned Features
            </CardTitle>
          </CardHeader>

          <CardContent>
            <PlanFeatureTable
              planId={selectedPlanId}
              onAddFeature={() =>
                setDialogOpen(true)
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Add Feature Dialog */}

      {selectedPlanId && (
        <PlanFeatureDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          planId={selectedPlanId}
        />
      )}

    </div>
  );
}