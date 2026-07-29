'use client';

import { useOrganization } from '../hooks/useOrganization';
import { useUpgradePlan } from '../hooks/useOrganizationMutations';
import { usePlans } from '@/features/subscriptions/hooks/usePlans';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { LoadingState } from '@/components/common/LoadingState';
import { Loader } from '@/components/common/Loader';
import { formatDate } from '@/lib/utils/format-date';

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  FileText,
  CalendarDays,
  CreditCard,
  ExternalLink,
} from 'lucide-react';

export function OrganizationDetail({ id }: { id: string }) {
  const { data: org, isLoading } = useOrganization(id);
  const { data: plansData } = usePlans('active');

  const upgradeMutation = useUpgradePlan(id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!org) {
    return (
      <p className="text-muted-foreground">
        Organization not found.
      </p>
    );
  }

  const currentPlan = plansData?.items.find(
    (plan) => plan.id === org.currentPlanId
  );

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {org.name}
            </h1>

            <p className="text-sm text-muted-foreground">
              Organization ID: {org.id}
            </p>
          </div>
        </div>

        <Badge
          variant={org.status === 'active' ? 'default' : 'destructive'}
          className="w-fit"
        >
          {org.status}
        </Badge>
      </div>


      {/* =========================
          BUSINESS DETAILS
      ========================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" />
            Business Details
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">

          <DetailItem
            icon={<Building2 className="h-4 w-4" />}
            label="Organization Name"
            value={org.name}
          />

          <DetailItem
            icon={<Mail className="h-4 w-4" />}
            label="Business Email"
            value={org.businessEmail}
          />

          <DetailItem
            icon={<Phone className="h-4 w-4" />}
            label="Business Phone"
            value={org.businessPhone}
          />

          <DetailItem
            icon={<MapPin className="h-4 w-4" />}
            label="Business Address"
            value={org.address}
          />

          <DetailItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Created At"
            value={formatDate(org.createdAt)}
          />

          <DetailItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Last Updated"
            value={formatDate(org.updatedAt)}
          />

        </CardContent>
      </Card>


      {/* =========================
          ORGANIZATION ADMIN
      ========================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4" />
            Organization Admin
          </CardTitle>
        </CardHeader>

        <CardContent>
          {org.admin ? (
            <div className="grid gap-6 sm:grid-cols-2">

              <DetailItem
                icon={<User className="h-4 w-4" />}
                label="Admin Name"
                value={org.admin.name}
              />

              <DetailItem
                icon={<Mail className="h-4 w-4" />}
                label="Login Email"
                value={org.admin.email}
              />

              <DetailItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={org.admin.phone ?? '—'}
              />

              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Account Status
                </p>

                <Badge
                  variant={
                    org.admin.status === 'active'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {org.admin.status}
                </Badge>
              </div>

            </div>
          ) : (
            <div className="rounded-md border border-dashed p-6 text-center">
              <ShieldCheck className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

              <p className="text-sm font-medium">
                No organization admin found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                An organization admin has not been assigned yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>


      {/* =========================
          SUBSCRIPTION
      ========================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" />
            Subscription
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">

          <div>
            <p className="text-sm text-muted-foreground">
              Current Plan
            </p>

            <p className="mt-1 font-medium">
              {currentPlan?.name ?? 'No active plan'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <Select
              onValueChange={(value) =>
                upgradeMutation.mutate(value)
              }
              disabled={upgradeMutation.isPending}
            >
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue placeholder="Change subscription plan" />
              </SelectTrigger>

              <SelectContent>
                {plansData?.items
                  .filter(
                    (plan) => plan.id !== org.currentPlanId
                  )
                  .map((plan) => (
                    <SelectItem
                      key={plan.id}
                      value={plan.id}
                    >
                      {plan.name} — {plan.userLimit} users
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {upgradeMutation.isPending && (
              <Loader className="h-4 w-4" />
            )}

          </div>

        </CardContent>
      </Card>


      {/* =========================
          DOCUMENTS
      ========================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Documents
          </CardTitle>
        </CardHeader>

        <CardContent>

          {org.documents && org.documents.length > 0 ? (

            <div className="divide-y rounded-md border">

              {org.documents.map((document, index) => (

                <div
                  key={`${document.fileKey}-${index}`}
                  className="flex items-center justify-between gap-4 p-4"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium">
                        {document.fileName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {document.mimeType}
                      </p>

                    </div>

                  </div>

                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
                  >
                    View
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                </div>

              ))}

            </div>

          ) : (

            <div className="rounded-md border border-dashed p-6 text-center">

              <FileText className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

              <p className="text-sm font-medium">
                No documents uploaded
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Organization documents will appear here.
              </p>

            </div>

          )}

        </CardContent>
      </Card>


      {/* =========================
          CONTACT PERSONS
      ========================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Contact Persons
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="rounded-md border border-dashed p-6 text-center">

            <User className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

            <p className="text-sm font-medium">
              Additional Contact Persons
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Additional organization contacts can be managed here.
            </p>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}


/* =========================
   REUSABLE DETAIL ITEM
========================= */

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3">

      <div className="mt-0.5 text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium">
          {value || '—'}
        </p>

      </div>

    </div>
  );
}