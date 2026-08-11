"use client";

import { useMemo } from "react";

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  CreditCard,
  Users,
  FileText,
  Calendar,
  ShieldCheck,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

import { useOrganization } from "../hooks/useOrganization";
import { useUpgradePlan } from "../hooks/useOrganizationMutations";
import { useSubscriptionPlans } from "@/features/subscription/hooks/plans/use-subscription-plans";

// import { ContactPersonList } from "./ContactPersonList";
// import { AddContactPersonDialog } from "./AddContactPersonDialog";

import { DocumentUpload } from "./DocumentUpload";
// import { DocumentList } from "./DocumentList";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

import { LoadingState } from "@/components/common/LoadingState";
import { formatDate } from "@/lib/utils/format-date";

export function OrganizationDetail({
  id,
}: {
  id: string;
}) {
  const {
    data: org,
    isLoading: organizationLoading,
    isError: organizationError,
  } = useOrganization(id);

  const {
    data: plansData,
    isLoading: plansLoading,
  } = useSubscriptionPlans({
    page: 1,
    limit: 100,
    status: "active",
  });

  const upgradeMutation = useUpgradePlan(id);

  const plans = plansData?.items ?? [];

  const currentPlan = useMemo(() => {
    return plans.find(
      (plan) => plan.id === org?.currentPlanId
    );
  }, [plans, org?.currentPlanId]);

  const availablePlans = useMemo(() => {
    return plans.filter(
      (plan) => plan.id !== org?.currentPlanId
    );
  }, [plans, org?.currentPlanId]);

  const handlePlanChange = (planId: string) => {
    if (
      !planId ||
      planId === org?.currentPlanId ||
      upgradeMutation.isPending
    ) {
      return;
    }

    upgradeMutation.mutate(planId);
  };

  if (organizationLoading) {
    return <LoadingState />;
  }

  if (organizationError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <h2 className="text-lg font-semibold">
            Unable to load organization
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading the organization.
          </p>

        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-3 text-lg font-semibold">
            Organization not found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The organization may have been deleted or you may not
            have permission to view it.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-2xl font-semibold tracking-tight">
                {org.name}
              </h1>

              <Badge
                variant={
                  org.status === "active"
                    ? "default"
                    : "destructive"
                }
              >
                {org.status}
              </Badge>

            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {org.businessEmail}
            </p>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* BUSINESS INFORMATION */}
      {/* ================================================= */}

      <Card>

        <CardHeader>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-4 w-4" />
            </div>

            <div>

              <CardTitle>
                Business Information
              </CardTitle>

              <CardDescription>
                Registered information for this organization.
              </CardDescription>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <Info
              icon={<Mail className="h-4 w-4" />}
              label="Business Email"
              value={org.businessEmail}
            />

            <Info
              icon={<Phone className="h-4 w-4" />}
              label="Business Phone"
              value={org.businessPhone || "—"}
            />

            <Info
              icon={<MapPin className="h-4 w-4" />}
              label="Address"
              value={org.address || "—"}
            />

            <Info
              icon={<Calendar className="h-4 w-4" />}
              label="Created"
              value={formatDate(org.createdAt)}
            />

          </div>

        </CardContent>

      </Card>

      {/* ================================================= */}
      {/* ADMIN + SUBSCRIPTION */}
      {/* ================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ADMIN */}

        <Card>

          <CardHeader>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>

                <CardTitle>
                  Organization Administrator
                </CardTitle>

                <CardDescription>
                  Primary administrator for this organization.
                </CardDescription>

              </div>

            </div>

          </CardHeader>

          <CardContent>

            {org.admin ? (

              <div className="grid gap-5 sm:grid-cols-2">

                <Info
                  icon={<User className="h-4 w-4" />}
                  label="firstName"
                  value={org.admin.firstName}
                />

                <Info
                  icon={<User className="h-4 w-4" />}
                  label="lastName"
                  value={org.admin.lastName}
                />
                <Info
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={org.admin.email}
                />

                <Info
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={org.admin.phone || "—"}
                />

                <Info
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Status"
                  value={
                    <Badge
                      variant={
                        org.admin.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {org.admin.status}
                    </Badge>
                  }
                />

              </div>

            ) : (

              <div className="rounded-lg border bg-muted/30 p-4">

                <p className="text-sm font-medium">
                  Administrator invitation pending
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  The organization administrator has not accepted
                  the invitation yet.
                </p>

              </div>

            )}

          </CardContent>

        </Card>

        {/* SUBSCRIPTION */}

        <Card>

          <CardHeader>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-4 w-4" />
              </div>

              <div>

                <CardTitle>
                  Subscription
                </CardTitle>

                <CardDescription>
                  Current subscription plan and billing.
                </CardDescription>

              </div>

            </div>

          </CardHeader>

          <CardContent className="space-y-5">

            {/* Current plan */}

            <div className="rounded-lg border bg-muted/30 p-4">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Current Plan
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {currentPlan?.name || "No plan assigned"}
                  </p>

                </div>

                {currentPlan && (
                  <Badge variant="secondary">
                    {currentPlan.billingInterval}
                  </Badge>
                )}

              </div>

              {currentPlan && (
                <div className="mt-3">

                  <p className="text-xl font-semibold">

                    {formatPrice(
                      currentPlan.priceInMinorUnit,
                      currentPlan.currency
                    )}

                  </p>

                  <p className="text-xs text-muted-foreground">
                    per {currentPlan.billingInterval}
                  </p>

                </div>
              )}

            </div>

            {/* Change plan */}

            <div className="space-y-2">

              <p className="text-sm font-medium">
                Change subscription plan
              </p>

              <Select
                onValueChange={handlePlanChange}
                disabled={
                  plansLoading ||
                  upgradeMutation.isPending ||
                  availablePlans.length === 0
                }
              >

                <SelectTrigger className="w-full">

                  <SelectValue
                    placeholder={
                      plansLoading
                        ? "Loading plans..."
                        : availablePlans.length === 0
                          ? "No other plans available"
                          : "Select a new plan"
                    }
                  />

                </SelectTrigger>

                <SelectContent>

                  {availablePlans.map((plan) => (

                    <SelectItem
                      key={plan.id}
                      value={plan.id}
                    >

                      <div className="flex items-center gap-2">

                        <span>
                          {plan.name}
                        </span>

                        <span className="text-muted-foreground">
                          —
                        </span>

                        <span>
                          {formatPrice(
                            plan.priceInMinorUnit,
                            plan.currency
                          )}
                        </span>

                        <span className="text-muted-foreground">
                          / {plan.billingInterval}
                        </span>

                      </div>

                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

              {upgradeMutation.isPending && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">

                  <Loader2 className="h-3 w-3 animate-spin" />

                  Updating subscription...

                </div>
              )}

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ================================================= */}
      {/* CONTACT PERSONS */}
      {/* ================================================= */}

      <Card>

        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Users className="h-4 w-4" />
            </div>

            <div>

              <CardTitle>
                Contact Persons
              </CardTitle>

              <CardDescription>
                Manage people associated with this organization.
              </CardDescription>

            </div>

          </div>

          {/* <AddContactPersonDialog
            organizationId={id}
          /> */}

        </CardHeader>

        <CardContent>

          {/* <ContactPersonList
            organizationId={id}
          /> */}

        </CardContent>

      </Card>

      {/* ================================================= */}
      {/* DOCUMENTS */}
      {/* ================================================= */}

      <Card>

        <CardHeader>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-4 w-4" />
            </div>

            <div>

              <CardTitle>
                Documents
              </CardTitle>

              <CardDescription>
                Manage organization verification and business documents.
              </CardDescription>

            </div>

          </div>

        </CardHeader>

        <CardContent className="space-y-6">

          <DocumentUpload
            organizationId={id}
          />

          {/* <DocumentList
            organizationId={id}
          /> */}

        </CardContent>

      </Card>

    </div>
  );
}

/* ================================================= */
/* INFO COMPONENT */
/* ================================================= */

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-3">

      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium">
          {value}
        </p>

      </div>

    </div>
  );
}

/* ================================================= */
/* PRICE FORMATTER */
/* ================================================= */

function formatPrice(
  priceInMinorUnit: number,
  currency: string
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(
    priceInMinorUnit / 100
  );
}