"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Building2, User, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useOrganization } from "../hooks/useOrganization";
import { organizationApi } from "../api/organization.api";
import { useSubscriptionPlans } from "@/features/subscription/hooks/plans/useSubscriptionPlan";
import { LoadingState } from "@/components/common/LoadingState";
import { editOrganizationFormSchema, EditOrganizationFormValues } from "../schemas/organization.schema";

const NO_PLAN_VALUE = "none" as const;

export function OrganizationEditForm({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const { data: org, isLoading } = useOrganization(id);

  const { data: plansData, isLoading: plansLoading } = useSubscriptionPlans({
    page: 1,
    limit: 100,
    status: "active",
  });

  const plans = plansData?.items ?? [];

  const [selectedPlanId, setSelectedPlanId] = useState<string>(NO_PLAN_VALUE);

  useEffect(() => {
    setSelectedPlanId(org?.currentPlanId ?? NO_PLAN_VALUE);
  }, [org?.currentPlanId]);

  const currentPlan = useMemo(
    () => plans.find((plan) => plan.id === org?.currentPlanId),
    [plans, org?.currentPlanId]
  );

  const isPlanChanged =
    selectedPlanId !== NO_PLAN_VALUE &&
  selectedPlanId !== (org?.currentPlanId ?? NO_PLAN_VALUE);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditOrganizationFormValues>({
    resolver: zodResolver(editOrganizationFormSchema),
    defaultValues: {
      name: "",
      businessEmail: "",
      businessPhone: "",
      address: "",
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
      adminPhone: "",
    },
  });

  useEffect(() => {
    if (!org) return;
    reset({
      name: org.name,
      businessEmail: org.businessEmail,
      businessPhone: org.businessPhone,
      address: org.address,
      adminFirstName: org.admin?.firstName ?? "",
      adminLastName: org.admin?.lastName ?? "",
      adminEmail: org.admin?.email ?? "",
      adminPhone: org.admin?.phone ?? "",
    });
  }, [org, reset]);

  const saveMutation = useMutation({
    mutationFn: (values: EditOrganizationFormValues) =>
      Promise.all([
        organizationApi.update(id, {
          name: values.name,
          businessEmail: values.businessEmail,
          businessPhone: values.businessPhone,
          address: values.address,
        }),
        organizationApi.updateAdmin(id, {
          firstName: values.adminFirstName,
          lastName: values.adminLastName,
          email: values.adminEmail,
          phone: values.adminPhone,
        }),
      ]),
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update organization");
    },
  });

  const changePlanMutation = useMutation({
    mutationFn: (planId: string) => organizationApi.upgradePlan(id, planId),
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to change plan");
    },
  });

  const isSubmitting = saveMutation.isPending || changePlanMutation.isPending;
  const canSubmit = (isDirty || isPlanChanged) && !isSubmitting;

  const onSubmit = async (values: EditOrganizationFormValues) => {
    try {
      if (isDirty) {
        await saveMutation.mutateAsync(values);
      }

      if (isPlanChanged) {
        await changePlanMutation.mutateAsync(selectedPlanId);
      }

      toast.success("Organization updated");
      queryClient.invalidateQueries({ queryKey: ["organization", id] });
    } catch {
      // individual mutations already toast their own errors
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-4xl space-y-6">
      {/* BUSINESS INFO */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Organization's business details.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Organization Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input id="businessPhone" {...register("businessPhone")} />
              {errors.businessPhone && (
                <p className="text-xs text-destructive">{errors.businessPhone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="businessEmail">Business Email</Label>
            <Input id="businessEmail" type="email" {...register("businessEmail")} />
            {errors.businessEmail && (
              <p className="text-xs text-destructive">{errors.businessEmail.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Business Address</Label>
            <Textarea id="address" {...register("address")} />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ADMINISTRATOR */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <User className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Administrator</CardTitle>
              <CardDescription>The contact person who administers this organization.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="adminFirstName">First Name</Label>
              <Input id="adminFirstName" {...register("adminFirstName")} />
              {errors.adminFirstName && (
                <p className="text-xs text-destructive">{errors.adminFirstName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminLastName">Last Name</Label>
              <Input id="adminLastName" {...register("adminLastName")} />
              {errors.adminLastName && (
                <p className="text-xs text-destructive">{errors.adminLastName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminEmail">Email</Label>
              <Input id="adminEmail" type="email" {...register("adminEmail")} />
              {errors.adminEmail && (
                <p className="text-xs text-destructive">{errors.adminEmail.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminPhone">Phone</Label>
              <Input id="adminPhone" {...register("adminPhone")} />
              {errors.adminPhone && (
                <p className="text-xs text-destructive">{errors.adminPhone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUBSCRIPTION PLAN */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Current plan for this organization.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current Plan
            </p>
            <p className="mt-1 text-lg font-semibold">
              {currentPlan?.title ?? "No active plan assigned"}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Select Plan</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId} disabled={plansLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PLAN_VALUE}>
                  <span className="text-muted-foreground">No plan</span>
                </SelectItem>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SINGLE SAVE BUTTON (business info + admin + plan) */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}