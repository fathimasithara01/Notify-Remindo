"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, Building2, UserRound, CreditCard } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useOrganization } from "../hooks/useOrganization";
import {
  useUpdateOrganization,
  useUpdateOrganizationAdmin,
  useUpgradePlan,
} from "../hooks/useOrganizationMutations";
import { useSubscriptionPlans } from "@/features/subscription/hooks/plans/useSubscriptionPlan";
import { LoadingState } from "@/components/common/LoadingState";
import {
  editOrganizationFormSchema,
  EditOrganizationFormValues,
} from "../schemas/organization.schema";
import { ROUTES } from "@/config/routes";

const NO_PLAN_VALUE = "none" as const;

const BUSINESS_FIELDS = ["name", "businessEmail", "businessPhone", "address"] as const;
const ADMIN_FIELDS = ["adminFirstName", "adminLastName", "adminEmail", "adminPhone"] as const;

function RequiredMark() {
  return (
    <span className="ml-1 text-destructive" aria-hidden="true">
      *
    </span>
  );
}

export function OrganizationEditForm({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: org, isLoading } = useOrganization(id);

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

  const [selectedPlanId, setSelectedPlanId] = useState<string>(NO_PLAN_VALUE);

  useEffect(() => {
    setSelectedPlanId(org?.currentPlanId || NO_PLAN_VALUE);
  }, [org?.currentPlanId]);

  const currentPlan = useMemo(
    () => plans.find((plan) => plan.id === org?.currentPlanId),
    [plans, org?.currentPlanId]
  );

  const currentPlanIdOrNone = org?.currentPlanId || NO_PLAN_VALUE;
  const isPlanChanged = selectedPlanId !== currentPlanIdOrNone;

  const form = useForm<EditOrganizationFormValues>({
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
    form.reset({
      name: org.name,
      businessEmail: org.businessEmail,
      businessPhone: org.businessPhone,
      address: org.address,
      adminFirstName: org.admin?.firstName ?? "",
      adminLastName: org.admin?.lastName ?? "",
      adminEmail: org.admin?.email ?? "",
      adminPhone: org.admin?.phone ?? "",
    });
  }, [org, form]);

  const {
    formState: { isDirty, dirtyFields },
  } = form;

  // ✅ Section-wise dirty tracking — only call the mutation for the
  // section that actually changed, instead of firing both on any edit.
  const isBusinessDirty = BUSINESS_FIELDS.some((f) => dirtyFields[f]);
  const isAdminDirty = ADMIN_FIELDS.some((f) => dirtyFields[f]);

  const updateOrg = useUpdateOrganization(id);
  const updateAdmin = useUpdateOrganizationAdmin(id);
  const upgradePlan = useUpgradePlan(id);

  const isSubmitting =
    updateOrg.isPending || updateAdmin.isPending || upgradePlan.isPending;

  const canSubmit = (isDirty || isPlanChanged) && !isSubmitting;

  const mutationError =
    updateOrg.error || updateAdmin.error || upgradePlan.error;

  const onSubmit = async (values: EditOrganizationFormValues) => {
    const planIdToSubmit = selectedPlanId;
    const shouldChangePlan =
      planIdToSubmit !== NO_PLAN_VALUE &&
      planIdToSubmit !== currentPlanIdOrNone &&
      planIdToSubmit !== "";

    try {
      const mutations: Promise<unknown>[] = [];

      if (isBusinessDirty) {
        mutations.push(
          updateOrg.mutateAsync({
            name: values.name,
            businessEmail: values.businessEmail,
            businessPhone: values.businessPhone,
            address: values.address,
          })
        );
      }

      if (isAdminDirty) {
        mutations.push(
          updateAdmin.mutateAsync({
            firstName: values.adminFirstName,
            lastName: values.adminLastName,
            email: values.adminEmail,
            phone: values.adminPhone,
          })
        );
      }

      if (mutations.length > 0) {
        await Promise.all(mutations);
      }

      if (shouldChangePlan) {
        await upgradePlan.mutateAsync(planIdToSubmit);
      }

      // ✅ Removed the extra invalidateQueries here — useUpdateOrganization,
      // useUpdateOrganizationAdmin, and useUpgradePlan already invalidate
      // the correct query keys in their own onSuccess handlers.
      // A second invalidate here (with a different/wrong key shape) was
      // triggering an unnecessary extra fetch.
    } catch {
      // individual mutations already toast their own errors
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) {
      return;
    }
    router.push(ROUTES.organizations.list);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Organization
            </h1>
            <p className="text-sm text-muted-foreground">
              Update business details, administrator, and subscription plan.
            </p>
          </div>
        </div>
      </div>

      {mutationError && (
        <Alert variant="destructive">
          <AlertDescription>
            {mutationError instanceof Error
              ? mutationError.message
              : "Unable to update organization. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* BUSINESS INFO */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Organization&apos;s business details.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Organization Name
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g. Tech Solutions Pvt Ltd"
                        autoComplete="organization"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Email
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={isSubmitting}
                        placeholder="info@company.com"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Phone
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        inputMode="tel"
                        disabled={isSubmitting}
                        placeholder="+91 9876543210"
                        autoComplete="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Business Address
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        disabled={isSubmitting}
                        placeholder="Enter complete business address"
                        autoComplete="street-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ADMINISTRATOR */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle>Administrator</CardTitle>
                  <CardDescription>
                    The contact person who administers this organization.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="adminFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g. John"
                        autoComplete="given-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g. Doe"
                        autoComplete="family-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={isSubmitting}
                        placeholder="admin@company.com"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        inputMode="tel"
                        disabled={isSubmitting}
                        placeholder="+91 9876543210"
                        autoComplete="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* SUBSCRIPTION */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>
                    Current plan for this organization.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current Plan
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {currentPlan?.title ?? "No active plan assigned"}
                </p>
              </div>

              {plansLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              )}

              {plansError && !plansLoading && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive">
                    Unable to load subscription plans.
                  </p>
                </div>
              )}

              {!plansLoading && !plansError && (
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">Select Plan</p>
                  <Select
                    value={selectedPlanId}
                    onValueChange={(val) => setSelectedPlanId(val || NO_PLAN_VALUE)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_PLAN_VALUE}>
                        <span className="text-muted-foreground">No plan</span>
                      </SelectItem>
                      {plans
                        .filter((plan) => !!plan.id)
                        .map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ACTION BAR — sticky footer */}
          <div className="sticky bottom-0 z-10 -mx-4 border-t bg-background px-4 py-4 md:-mx-6 md:px-6">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <div className="ml-auto flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}