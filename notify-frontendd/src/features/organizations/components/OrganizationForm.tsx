"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Building2,
  UserRound,
  CreditCard,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { useCreateOrganization } from "../hooks/useOrganizationMutations";
import { useSubscriptionPlans } from "@/features/subscription/hooks/plans/useSubscriptionPlan";

import {
  createOrganizationSchema,
  CreateOrganizationFormValues,
} from "../schemas/organization.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { InviteSuccessDialog } from "@/features/rbac/users/components/InviteSuccessDialog";

import { ROUTES } from "@/config/routes";

function RequiredMark() {
  return (
    <span className="ml-1 text-destructive" aria-hidden="true">
      *
    </span>
  );
}

interface OrgInviteResult {
  adminName: string;
  value: string;
  emailSent?: boolean;
  kind: "invite" | "temp-password";
}

export function OrganizationForm() {
  const router = useRouter();

  const createMutation = useCreateOrganization();

  const [inviteResult, setInviteResult] = useState<OrgInviteResult | null>(null);

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
      inviteMethod: "email",

      admin: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
    },

    mode: "onBlur",
  });

  const selectedPlanId = form.watch("planId");
  const inviteMethod = form.watch("inviteMethod");

  const selectedPlan = useMemo(() => {
    return plans.find((plan) => plan.id === selectedPlanId);
  }, [plans, selectedPlanId]);

  const isSubmitting = createMutation.isPending;
  const isDisabled = isSubmitting || plansLoading;

  const onSubmit = (values: CreateOrganizationFormValues) => {
    createMutation.mutate(values, {
      onSuccess: (result) => {
        if (result.tempPassword) {
          setInviteResult({
            adminName: result.admin.firstName,
            value: result.tempPassword,
            kind: "temp-password",
          });
        } else {
          setInviteResult({
            adminName: result.admin.firstName,
            value: result.inviteUrl!,
            emailSent: result.emailSent,
            kind: "invite",
          });
        }
      },
    });
  };

  // Leaving the org creation page only happens once the admin has
  // acknowledged the invite link / temp password — closing the dialog
  // early (e.g. accidental click outside) shouldn't lose the org they
  // just created, so navigation lives here, not in onSuccess.
  const handleInviteResultClose = () => {
    setInviteResult(null);
    router.push(ROUTES.organizations.list);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* API ERROR */}
      {/* ================================================= */}

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              {/* Organization Name */}
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

              {/* Business Email */}
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

              {/* Business Phone */}
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
                        disabled={isSubmitting}
                        placeholder="+91 9876543210"
                        autoComplete="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
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
                      <Input
                        {...field}
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


          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <UserRound className="h-4 w-4" />
                </div>

                <div>
                  <CardTitle>Organization Administrator Contact Person</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Invite method */}
              <FormField
                control={form.control}
                name="inviteMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    {/* <FormLabel>How should the admin get access?</FormLabel> */}
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <label
                          htmlFor="method-email"
                          className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                        >
                          <RadioGroupItem
                            value="email"
                            id="method-email"
                            className="mt-1"
                            disabled={isSubmitting}
                          />
                          <div className="space-y-1">
                            <Label
                              htmlFor="method-email"
                              className="font-medium cursor-pointer"
                            >
                              Send invite link (recommended)
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              The administrator will receive an email with a
                              link to set their own password.
                            </p>
                          </div>
                        </label>

                        <label
                          htmlFor="method-temp"
                          className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                        >
                          <RadioGroupItem
                            value="temppassword"
                            id="method-temp"
                            className="mt-1"
                            disabled={isSubmitting}
                          />
                          <div className="space-y-1">
                            <Label
                              htmlFor="method-temp"
                              className="font-medium cursor-pointer"
                            >
                              Set a temporary password
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              You&apos;ll get a password to share with them
                              manually. They must change it on first login.
                            </p>
                          </div>
                        </label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div className="rounded-lg border bg-muted/40 p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {inviteMethod === "temppassword"
                        ? "Manual password sharing"
                        : "Invitation-based access"}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {inviteMethod === "temppassword"
                        ? "No email is sent. After creating the organization, you'll see a one-time password to copy and share with the administrator directly."
                        : "The administrator will receive an invitation email. They can use the invitation link to create their password and access the organization. If email delivery fails, you'll get a copyable link as a fallback."}
                    </p>
                  </div>
                </div>
              </div> */}

              <div className="grid gap-6 md:grid-cols-2">
                {/* Admin First Name */}
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

                {/* Admin Last Name */}
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

                {/* Admin Phone */}
                <FormField
                  control={form.control}
                  name="admin.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          disabled={isSubmitting}
                          placeholder="+91 9876543210"
                          autoComplete="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Admin Email */}
                <FormField
                  control={form.control}
                  name="admin.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Admin Login Email
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
                        {inviteMethod === "temppassword"
                          ? "This will be their login email."
                          : "The invitation will be sent to this email address."}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ================================================= */}
          {/* SUBSCRIPTION */}
          {/* ================================================= */}

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
                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading available subscription plans...
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
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subscription plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {plan.title}
                                </span>
                                <span className="text-muted-foreground">
                                  —
                                </span>
                                <span>
                                  {plan.amountValue},
                                  {plan.currency}
                                </span>

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
                  <p className="text-sm font-medium">
                    No active subscription plans
                  </p>
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
                      <p className="mt-1 font-semibold">
                        {selectedPlan.title}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {selectedPlan.amountValue},
                        {selectedPlan.currency}
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

          {/* ================================================= */}
          {/* ACTION BAR */}
          {/* ================================================= */}

          <div className="sticky bottom-0 z-10 -mx-4 border-t bg-background/95 px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <p className="hidden text-xs text-muted-foreground sm:block">
                Fields marked with{" "}
                <span className="text-destructive">*</span> are required.
              </p>

              <div className="ml-auto flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => router.push(ROUTES.organizations.list)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    plansLoading ||
                    plansError ||
                    plans.length === 0
                  }
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* ================================================= */}
      {/* INVITE RESULT — shown once, after successful create */}
      {/* ================================================= */}

      {inviteResult && (
        <InviteSuccessDialog
          open={!!inviteResult}
          onOpenChange={(o) => !o && handleInviteResultClose()}
          userName={inviteResult.adminName}
          value={inviteResult.value}
          emailSent={inviteResult.emailSent}
          kind={inviteResult.kind}
        />
      )}
    </div>
  );
} 