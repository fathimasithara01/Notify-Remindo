"use client";

import { useParams, useRouter } from "next/navigation";
import { Building2, ArrowLeft } from "lucide-react";

import { useOrganization } from "@/features/organizations/hooks/useOrganization";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { BusinessInformationSection } from "@/features/organizations/components/edit/BusinessInformationSection";
import { AdministratorSection } from "@/features/organizations/components/edit/AdministratorSection";
import { SubscriptionPlanSection } from "@/features/organizations/components/edit/SubscriptionPlanSection";

import { ROUTES } from "@/config/routes";

export default function OrganizationEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const organizationId = params.id;

  const { data: organization, isLoading, isError } = useOrganization(organizationId);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push(ROUTES.organizations.detail(organizationId))}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isLoading ? <Skeleton className="h-6 w-48" /> : organization?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage business info, administrator, and subscription.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Unable to load this organization.
        </p>
      )}

      {organization && (
        <>
          {/* Each section owns its own form state + mutation + save action */}
          <BusinessInformationSection organization={organization} />
          <AdministratorSection organization={organization} />
          <SubscriptionPlanSection organization={organization} />
        </>
      )}
    </div>
  );
}