"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createSubscriptionPlanSchema,
  CreateSubscriptionPlanFormData,
} from "../../schemas/subscription-plan.schema";

import { useCreateSubscriptionPlan } from "../../hooks/plans/use-create-subscription-plan";
import { useUpdateSubscriptionPlan } from "../../hooks/plans/use-update-subscription-plan";

import { SubscriptionPlan } from "../../types/subscription-plan.types";

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SubscriptionPlanForm({
  plan,
  onSuccess,
  onCancel,
}: SubscriptionPlanFormProps) {
  const isEdit = Boolean(plan);

  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  const form = useForm<CreateSubscriptionPlanFormData>({
    resolver: zodResolver(createSubscriptionPlanSchema),

    defaultValues: {
      name: "",
      description: "",
      priceInMinorUnit: 0,
      currency: "INR",
      billingInterval: "monthly",
      trialDays: undefined,
      status: "draft",
    },
  });

  /**
   * Reset form when editing/creating a plan.
   *
   * Backend stores:
   *
   * ₹2000 -> 200000 paise
   *
   * UI displays:
   *
   * 200000 / 100 -> 2000
   */
  useEffect(() => {
    if (!plan) {
      form.reset({
        name: "",
        description: "",
        priceInMinorUnit: 0,
        currency: "INR",
        billingInterval: "monthly",
        trialDays: undefined,
        status: "draft",
      });

      return;
    }

    form.reset({
      name: plan.name,
      description: plan.description ?? "",

      // Backend value remains in minor units.
      priceInMinorUnit: plan.priceInMinorUnit,

      currency: plan.currency,
      billingInterval: plan.billingInterval,
      trialDays: plan.trialDays ?? undefined,
      status: plan.status,
    });
  }, [plan, form]);

  const onSubmit = (
    values: CreateSubscriptionPlanFormData
  ) => {
    if (isEdit && plan) {
      updateMutation.mutate(
        {
          id: plan.id,
          data: values,
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );

      return;
    }

    createMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* ================================================= */}
        {/* PLAN INFORMATION */}
        {/* ================================================= */}

        <section className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">
              Plan Information
            </h3>

            <p className="text-sm text-muted-foreground">
              Configure the basic information for this
              subscription plan.
            </p>
          </div>

          {/* Plan Name */}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Plan Name
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder="Professional Plan"
                    disabled={isPending}
                  />
                </FormControl>

                <FormDescription>
                  Enter a unique name for the subscription
                  plan.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description
                </FormLabel>

                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Describe what customers receive with this plan..."
                    disabled={isPending}
                  />
                </FormControl>

                <FormDescription>
                  Optional description shown to customers.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* ================================================= */}
        {/* PRICING */}
        {/* ================================================= */}

        <section className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">
              Pricing
            </h3>

            <p className="text-sm text-muted-foreground">
              Set the price and currency for this plan.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Price */}

            <FormField
              control={form.control}
              name="priceInMinorUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Price
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="2000"
                      disabled={isPending}
                      value={
                        field.value === 0
                          ? ""
                          : field.value / 100
                      }
                      onChange={(event) => {
                        const input =
                          event.target.value;

                        if (input === "") {
                          field.onChange(0);
                          return;
                        }

                        const majorUnit =
                          Number(input);

                        if (
                          !Number.isFinite(
                            majorUnit
                          ) ||
                          majorUnit < 0
                        ) {
                          return;
                        }

                        const minorUnit =
                          Math.round(
                            majorUnit * 100
                          );

                        field.onChange(
                          minorUnit
                        );
                      }}
                    />
                  </FormControl>

                  <FormDescription>
                    Enter the normal price.
                    Example: ₹2,000.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency */}

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Currency
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={
                      field.onChange
                    }
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="INR">
                        🇮🇳 Indian Rupee (INR)
                      </SelectItem>

                      <SelectItem value="USD">
                        🇺🇸 US Dollar (USD)
                      </SelectItem>

                      <SelectItem value="EUR">
                        🇪🇺 Euro (EUR)
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    Select the currency used for billing.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ================================================= */}
        {/* BILLING */}
        {/* ================================================= */}

        <section className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">
              Billing Configuration
            </h3>

            <p className="text-sm text-muted-foreground">
              Configure billing frequency and trial period.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Billing Interval */}

            <FormField
              control={form.control}
              name="billingInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Billing Interval
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={
                      field.onChange
                    }
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing interval" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="weekly">
                        Weekly
                      </SelectItem>

                      <SelectItem value="monthly">
                        Monthly
                      </SelectItem>

                      <SelectItem value="yearly">
                        Yearly
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    How frequently the customer will be
                    billed.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trial Days */}

            <FormField
              control={form.control}
              name="trialDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Trial Period
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="0"
                      disabled={isPending}
                      value={
                        field.value ?? ""
                      }
                      onChange={(event) => {
                        const input =
                          event.target.value;

                        if (input === "") {
                          field.onChange(
                            undefined
                          );
                          return;
                        }

                        const days =
                          Number(input);

                        if (
                          Number.isInteger(
                            days
                          ) &&
                          days >= 0
                        ) {
                          field.onChange(
                            days
                          );
                        }
                      }}
                    />
                  </FormControl>

                  <FormDescription>
                    Number of free trial days.
                    Use 0 for no trial.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ================================================= */}
        {/* PLAN STATUS */}
        {/* ================================================= */}

        <section className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">
              Plan Status
            </h3>

            <p className="text-sm text-muted-foreground">
              Control whether this plan is available for
              organizations.
            </p>
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Status
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="draft">
                      🟡 Draft
                    </SelectItem>

                    <SelectItem value="active">
                      🟢 Active
                    </SelectItem>

                    <SelectItem value="inactive">
                      🔴 Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormDescription>
                  Only active plans can be assigned to
                  organizations.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* ================================================= */}
        {/* FORM ACTIONS */}
        {/* ================================================= */}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
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
            disabled={isPending}
            className="min-w-[150px]"
          >
            {isPending
              ? "Saving..."
              : isEdit
                ? "Update Plan"
                : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}