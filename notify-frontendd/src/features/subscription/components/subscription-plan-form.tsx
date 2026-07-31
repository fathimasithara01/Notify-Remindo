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
} from "../schemas/subscription-plan.schema";

import {
  useCreateSubscriptionPlan,
} from "../hooks/use-create-subscription-plan";

import {
  useUpdateSubscriptionPlan,
} from "../hooks/use-update-subscription-plan";

import {
  SubscriptionPlan,
} from "../types/subscription-plan.types";

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SubscriptionPlanForm({ plan, onSuccess, onCancel }: SubscriptionPlanFormProps) {
  const isEdit = Boolean(plan);
  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();

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
      priceInMinorUnit: plan.priceInMinorUnit,
      currency: plan.currency,
      billingInterval: plan.billingInterval,
      trialDays: plan.trialDays ?? 0,
      status: plan.status,
    });
  }, [plan, form]);

  const onSubmit = (data: CreateSubscriptionPlanFormData) => {
    if (isEdit && plan) {
      updateMutation.mutate(
        {
          id: plan.id,
          data,
        },

        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
      return;
    }

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

  const isPending = createMutation.isPending ||
    updateMutation.isPending;

  return (

    <Form {...form}>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* Plan Information */}

        <div className="space-y-5">

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
                    placeholder="Professional Plan"
                    disabled={isPending}
                    {...field}
                  />

                </FormControl>

                <FormDescription>
                  A unique name for this subscription plan.
                </FormDescription>

                <FormMessage />

              </FormItem>

            )}
          />

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
                    rows={4}
                    placeholder="Describe what customers receive with this plan..."
                    disabled={isPending}
                    {...field}
                  />

                </FormControl>

                <FormDescription>
                  Optional description shown in the subscription details.
                </FormDescription>

                <FormMessage />

              </FormItem>

            )}
          />

        </div>

        {/* Pricing */}

        <div className="grid gap-5 md:grid-cols-2">

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
                    placeholder="99900"
                    disabled={isPending}
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value;

                      field.onChange(
                        value === "" ? undefined : Number(value)
                      );
                    }}
                  />
                </FormControl>

                <FormDescription>
                  Enter the amount in the smallest currency unit
                  (example: ₹999 = 99900 paise).
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

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
                  onValueChange={field.onChange}
                  disabled={isPending}
                >

                  <FormControl>

                    <SelectTrigger>

                      <SelectValue placeholder="Select Currency" />

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

                <FormMessage />

              </FormItem>

            )}
          />

        </div>

        {/* Billing & Trial */}

        <div className="grid gap-5 md:grid-cols-2">

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
                  onValueChange={field.onChange}
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
                  Choose how frequently customers are billed.
                </FormDescription>

                <FormMessage />

              </FormItem>

            )}
          />

          <FormField
            control={form.control}
            name="trialDays"
            render={({ field }) => (

              <FormItem>

                <FormLabel>
                  Trial Days
                </FormLabel>

                <FormControl>

                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    disabled={isPending}
                    value={field.value ?? "" }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />

                </FormControl>

                <FormDescription>
                  Set to <strong>0</strong> if there is no free trial.
                </FormDescription>

                <FormMessage />

              </FormItem>

            )}
          />

        </div>

        {/* Plan Status */}

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
                onValueChange={field.onChange}
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
                Only <strong>Active</strong> plans are available for organizations to subscribe to.
              </FormDescription>

              <FormMessage />

            </FormItem>

          )}
        />
        {/* Footer */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            pt-6
            sm:flex-row
            sm:justify-end
          "
        >

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
            className="min-w-[170px]"
          >

            {isPending
              ? (
                <>
                  Saving...
                </>
              )
              : isEdit
                ? "Update Plan"
                : "Create Plan"}

          </Button>

        </div>

      </form>

    </Form>

  );

}