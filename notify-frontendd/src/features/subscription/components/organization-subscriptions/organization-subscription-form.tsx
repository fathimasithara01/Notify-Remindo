"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createOrganizationSubscriptionSchema,
  CreateOrganizationSubscriptionFormData,
} from "../../schemas/organization-subscription.schema";

import { useCreateOrganizationSubscription } from "../../hooks/organization-subscriptions/use-create-organization-subscription";

import { useSubscriptionPlans } from "../../hooks/plans/use-subscription-plans";

import { useOrganizations } from "@/features/organizations/hooks/useOrganizations";

interface OrganizationSubscriptionFormProps {
  defaultOrganizationId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrganizationSubscriptionForm({
  defaultOrganizationId,
  onSuccess,
  onCancel,
}: OrganizationSubscriptionFormProps) {
  const createMutation =
    useCreateOrganizationSubscription();

  const {
    data: plansData,
    isLoading: plansLoading,
  } = useSubscriptionPlans({
    page: 1,
    limit: 100,
    status: "active",
  });

  const {
    data: organizationsData,
    isLoading: organizationsLoading,
  } = useOrganizations({
    page: 1,
    limit: 100,
  });

  const plans =
    plansData?.items ?? [];

  const organizations =
    organizationsData?.items ?? [];

  const form =
    useForm<CreateOrganizationSubscriptionFormData>({
      resolver: zodResolver(
        createOrganizationSubscriptionSchema
      ),

      defaultValues: {
        organizationId:
          defaultOrganizationId ?? "",

        planId: "",
      },
    });

  const isPending =
    createMutation.isPending;

  const onSubmit = (
    data: CreateOrganizationSubscriptionFormData
  ) => {
    createMutation.mutate(
      data,
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >
      {/* Organization */}

      <div className="space-y-2">
        <Label htmlFor="organization">
          Organization
        </Label>

        <Select
          value={form.watch(
            "organizationId"
          )}
          onValueChange={(value) =>
            form.setValue(
              "organizationId",
              value,
              {
                shouldValidate: true,
              }
            )
          }
          disabled={
            isPending ||
            organizationsLoading
          }
        >
          <SelectTrigger id="organization">
            <SelectValue
              placeholder={
                organizationsLoading
                  ? "Loading organizations..."
                  : "Select organization"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {organizations.map(
              (organization) => (
                <SelectItem
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        {form.formState.errors
          .organizationId && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .organizationId.message
            }
          </p>
        )}
      </div>

      {/* Subscription Plan */}

      <div className="space-y-2">
        <Label htmlFor="plan">
          Subscription Plan
        </Label>

        <Select
          value={form.watch("planId")}
          onValueChange={(value) =>
            form.setValue(
              "planId",
              value,
              {
                shouldValidate: true,
              }
            )
          }
          disabled={
            isPending ||
            plansLoading
          }
        >
          <SelectTrigger id="plan">
            <SelectValue
              placeholder={
                plansLoading
                  ? "Loading plans..."
                  : "Select subscription plan"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {plans.map((plan) => (
              <SelectItem
                key={plan.id}
                value={plan.id}
              >
                <div className="flex items-center gap-2">
                  <span>
                    {plan.name}
                  </span>

                  <span className="text-muted-foreground">
                    {plan.currency}{" "}
                    {(
                      plan.priceInMinorUnit /
                      100
                    ).toFixed(2)}
                    /
                    {plan.billingInterval}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {form.formState.errors
          .planId && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .planId.message
            }
          </p>
        )}
      </div>

      {/* Selected Plan Preview */}

      {form.watch("planId") && (
        <SelectedPlanPreview
          planId={form.watch("planId")}
          plans={plans}
        />
      )}

      {/* Actions */}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={
            isPending ||
            plansLoading ||
            organizationsLoading
          }
        >
          {isPending
            ? "Assigning..."
            : "Assign Subscription"}
        </Button>
      </div>
    </form>
  );
}

/* =========================================================
 * Selected Plan Preview
 * ========================================================= */

interface SelectedPlanPreviewProps {
  planId: string;

  plans: Array<{
    id: string;
    name: string;
    description?: string;
    priceInMinorUnit: number;
    currency: "USD" | "EUR" | "INR";
    billingInterval:
      | "weekly"
      | "monthly"
      | "yearly";
  }>;
}

function SelectedPlanPreview({
  planId,
  plans,
}: SelectedPlanPreviewProps) {
  const plan = plans.find(
    (item) => item.id === planId
  );

  if (!plan) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">
            {plan.name}
          </p>

          {plan.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {plan.description}
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="font-semibold">
            {plan.currency}{" "}
            {(
              plan.priceInMinorUnit / 100
            ).toFixed(2)}
          </p>

          <p className="text-xs text-muted-foreground">
            per {plan.billingInterval}
          </p>
        </div>
      </div>
    </div>
  );
}