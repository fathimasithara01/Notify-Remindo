"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Building2, UserRound, CreditCard, Loader2, EyeOff, Eye } from "lucide-react";

import { useCreateOrganization } from "../hooks/useOrganizationMutations";
import { useSubscriptionPlans } from "@/features/subscription/hooks/plans/useSubscriptionPlan";

import {
  createOrganizationSchema,
  CreateOrganizationFormValues,
} from "../schemas/organization.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { ROUTES } from "@/config/routes";

function RequiredMark() {
  return (
    <span className="ml-1 text-destructive" aria-hidden="true">
      *
    </span>
  );
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

export function OrganizationForm() {
  const router = useRouter();

  const createMutation = useCreateOrganization();

  const {
    data: plansData,
    isLoading: plansLoading,
    isError: plansError,
    refetch: refetchPlans,
  } = useSubscriptionPlans({
    page: 1,
    limit: 100,
    status: "active",
  });

  const plans = plansData?.items ?? [];

  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),

    defaultValues: {
      name: "",
      businessEmail: "",
      businessPhone: "",
      address: "",
      planId: "",

      admin: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      },
    },

    // mode: "onBlur",
  });

  const selectedPlanId = form.watch("planId");

  const selectedPlan = useMemo(() => {
    return plans.find((plan) => plan.id === selectedPlanId);
  }, [plans, selectedPlanId]);

  const isSubmitting = createMutation.isPending;
  const isDisabled = isSubmitting || plansLoading;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (values: CreateOrganizationFormValues) => {
    const { confirmPassword, ...adminPayload } = values.admin;

    createMutation.mutate(
      {
        ...values,
        admin: adminPayload,
      },
      {
        onSuccess: () => {
          router.push(ROUTES.organizations.list);
        },
      }
    );
  };

  const handleCancel = () => {
    if (form.formState.isDirty && !window.confirm("Discard unsaved changes?")) {
      return;
    }
    router.push(ROUTES.organizations.list);
  };

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
              Create Organization
            </h1>
            <p className="text-sm text-muted-foreground">
              Set up a new organization, assign an administrator, and select
              a subscription plan.
            </p>
          </div>
        </div>
      </div>

      {createMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : "Unable to create organization. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
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
                    Basic information about the organization.
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
                        autoFocus
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

          {/* ADMIN CONTACT */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle>Organization Administrator</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="admin.firstName"
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
                  name="admin.lastName"
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
                  name="admin.email"
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
                      <p className="text-xs text-muted-foreground">
                        This will be their login email.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admin.phone"
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

                <FormField
                  control={form.control}
                  name="admin.password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            disabled={isSubmitting}
                            placeholder="Enter a password"
                            autoComplete="new-password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admin.confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Confirm Password
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            disabled={isSubmitting}
                            placeholder="Re-enter the password"
                            autoComplete="new-password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                    Select the subscription plan for this organization.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
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
                  <p className="mt-1 text-xs text-muted-foreground">
                    Please try again before creating the organization.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => refetchPlans()}
                  >
                    Try again
                  </Button>
                </div>
              )}

              {!plansLoading && !plansError && plans.length > 0 && (
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Plan</FormLabel>
                      <Select
                        value={field.value || "none"}
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? "" : value)
                        }
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subscription plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            <span className="text-muted-foreground">No plan</span>
                          </SelectItem>
                          {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{plan.title}</span>
                                <span className="text-muted-foreground">—</span>
                                <span>{formatPlanPrice(plan.amountValue, plan.currency)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!plansLoading && !plansError && plans.length === 0 && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm font-medium">No active subscription plans</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create and activate a subscription plan before assigning
                    a plan to an organization.
                  </p>
                </div>
              )}

              {selectedPlan && (
                <div className="rounded-lg border bg-primary/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Selected Plan
                      </p>
                      <p className="mt-1 font-semibold">{selectedPlan.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPlanPrice(selectedPlan.amountValue, selectedPlan.currency)}
                      </p>
                    </div>
                  </div>

                  {selectedPlan.description && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {selectedPlan.description}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ACTION BAR — sticky footer */}
          <div className="sticky bottom-0 z-10 -mx-4 border-t bg-background px-4 py-4 md:-mx-6 md:px-6">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              {/* <p className="hidden text-xs text-muted-foreground sm:block">
                Fields marked with <span className="text-destructive">*</span> are required.
              </p> */}

              <div className="ml-auto flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || plansLoading || plansError || plans.length === 0}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}