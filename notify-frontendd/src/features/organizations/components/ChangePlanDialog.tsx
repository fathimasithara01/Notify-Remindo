"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { useUpgradePlan } from "../hooks/useOrganizationMutations";
import { useSubscriptionPlans } from "@/features/subscription/hooks/plans/useSubscriptionPlan";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ChangePlanDialogProps {
  organizationId: string;
  currentPlanId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPlanPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function ChangePlanDialog({
  organizationId,
  currentPlanId,
  open,
  onOpenChange,
}: ChangePlanDialogProps) {
  const { data: plansData, isLoading } = useSubscriptionPlans({
    page: 1,
    limit: 100,
    status: "active",
  });
  const plans = plansData?.items ?? [];

  const [selectedPlanId, setSelectedPlanId] = useState(currentPlanId ?? "");
  const upgradePlan = useUpgradePlan(organizationId);

  const isDirty = selectedPlanId !== (currentPlanId ?? "");

  const handleConfirm = () => {
    if (!selectedPlanId || !isDirty) return;
    upgradePlan.mutate(selectedPlanId, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !upgradePlan.isPending && onOpenChange(o)}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Change Plan</DialogTitle>
              <DialogDescription>
                Select a new subscription plan for this organization.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {!isLoading && (
          <RadioGroup value={selectedPlanId} onValueChange={setSelectedPlanId} className="space-y-2">
            {plans.map((plan) => (
              <label
                key={plan.id}
                htmlFor={`plan-${plan.id}`}
                className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem
                  value={plan.id}
                  id={`plan-${plan.id}`}
                  className="mt-1"
                  disabled={upgradePlan.isPending}
                />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`plan-${plan.id}`} className="font-medium cursor-pointer">
                      {plan.title}
                    </Label>
                    <span className="text-sm font-medium">
                      {formatPlanPrice(plan.amountValue, plan.currency)}
                    </span>
                  </div>
                  {plan.id === currentPlanId && (
                    <p className="text-xs text-muted-foreground">Current plan</p>
                  )}
                </div>
              </label>
            ))}
          </RadioGroup>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" disabled={upgradePlan.isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!isDirty || upgradePlan.isPending} onClick={handleConfirm}>
            {upgradePlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {upgradePlan.isPending ? "Updating..." : "Confirm Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}