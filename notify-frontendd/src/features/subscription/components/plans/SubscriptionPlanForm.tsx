"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  createSubscriptionPlanSchema,
  CreateSubscriptionPlanFormValues,
} from "../../schemas/subscription-plan.schema";

type SubscriptionPlanFormInput = z.input<typeof createSubscriptionPlanSchema>;
import { SubscriptionPlan, Currency } from "../../types/subscription-plan.types";
import { Feature } from "../../types/feature.types";
import { useFeatures } from "../../hooks/features/useFeature";

const CURRENCIES: Currency[] = ["USD", "EUR", "INR"];

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan | null;
  isSubmitting: boolean;
  onSubmit: (values: CreateSubscriptionPlanFormValues) => void;
  onCancel: () => void;
}

export function SubscriptionPlanForm({
  plan,
  isSubmitting,
  onSubmit,
  onCancel,
}: SubscriptionPlanFormProps) {
  const { data: featuresData } = useFeatures({ limit: 100 });
  const features: Feature[] = featuresData?.items ?? [];

  const form = useForm<SubscriptionPlanFormInput, any, CreateSubscriptionPlanFormValues>({
    resolver: zodResolver(createSubscriptionPlanSchema),
    defaultValues: {
      title: plan?.title ?? "",
      description: plan?.description ?? "",
      amountValue: plan?.amountValue ?? 0,
      currency: plan?.currency ?? "USD",
      userLimit: plan?.userLimit ?? 1,
      storageLimit: plan?.storageLimit ?? 1,
      featureIds: plan?.featureIds ?? [],
    },
  });

  useEffect(() => {
    form.reset({
      title: plan?.title ?? "",
      description: plan?.description ?? "",
      amountValue: plan?.amountValue ?? 0,
      currency: plan?.currency ?? "USD",
      userLimit: plan?.userLimit ?? 1,
      storageLimit: plan?.storageLimit ?? 1,
      featureIds: plan?.featureIds ?? [],
    });
  }, [plan, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amountValue"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    value={value as number | string}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userLimit"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>User limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={value as number | string}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storageLimit"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Storage (GB)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={value as number | string}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="featureIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-md border p-3">
                {features.map((feature) => {
                  const checked = field.value?.includes(feature.id);
                  return (
                    <label
                      key={feature.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const next = v
                            ? [...(field.value ?? []), feature.id]
                            : (field.value ?? []).filter((id) => id !== feature.id);
                          field.onChange(next);
                        }}
                      />
                      {feature.title}
                    </label>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : plan ? "Save changes" : "Create plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}