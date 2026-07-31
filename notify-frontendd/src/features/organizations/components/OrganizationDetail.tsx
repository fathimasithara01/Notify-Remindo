'use client';
import { ShieldCheck } from "lucide-react";
import { useOrganization } from '../hooks/useOrganization';
import { useUpgradePlan } from '../hooks/useOrganizationMutations';
import { useSubscriptionPlans } from "@/features/subscription/hooks/plans/use-subscription-plans";

import { ContactPersonList } from './ContactPersonList';
import { AddContactPersonDialog } from './AddContactPersonDialog';

import { DocumentUpload } from './DocumentUpload';
import { DocumentList } from './DocumentList';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';

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
} from 'lucide-react';

import { Loader } from '@/components/common/Loader';
import { LoadingState } from '@/components/common/LoadingState';

import { formatDate } from '@/lib/utils/format-date';

export function OrganizationDetail({
  id,
}: {
  id: string;
}) {

  const { data: org, isLoading } =
    useOrganization(id);

  const { data: plans } =
    useSubscriptionPlans({
      page: 1,
      limit: 100,
      status: "active",
    });



  const upgradeMutation =
    useUpgradePlan(id);

  if (isLoading)
    return <LoadingState />;

  if (!org)
    return (
      <p>
        Organization not found.
      </p>
    );

  const currentPlan =
    plans?.items.find(
      (p) => p.id === org.currentPlanId,
    );

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            {org.name}
          </h1>

          <p className="text-muted-foreground">
            {org.businessEmail}
          </p>

        </div>

        <Badge
          variant={
            org.status === 'active'
              ? 'default'
              : 'destructive'
          }
        >
          {org.status}
        </Badge>

      </div>

      {/* Business */}

      <Card>

        <CardHeader>

          <CardTitle>
            Business Information
          </CardTitle>

          <CardDescription>
            Registered business information.
          </CardDescription>

        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-6">

          <Info
            icon={<Mail size={18} />}
            label="Business Email"
            value={org.businessEmail}
          />

          <Info
            icon={<Phone size={18} />}
            label="Business Phone"
            value={org.businessPhone}
          />

          <Info
            icon={<MapPin size={18} />}
            label="Address"
            value={org.address || '-'}
          />

          <Info
            icon={<Calendar size={18} />}
            label="Created"
            value={formatDate(org.createdAt)}
          />

        </CardContent>

      </Card>

      {/* Admin */}

      <Card>

        <CardHeader>

          <CardTitle>
            Organization Admin
          </CardTitle>

        </CardHeader>

        <CardContent>

          {org.admin ? (

            <div className="grid grid-cols-2 gap-5">

              <Info
                icon={<User size={18} />}
                label="Name"
                value={org.admin.name}
              />

              <Info
                icon={<Mail size={18} />}
                label="Email"
                value={org.admin.email}
              />

              <Info
                icon={<Phone size={18} />}
                label="Phone"
                value={
                  org.admin.phone ??
                  '-'
                }
              />

              <Info
                icon={<ShieldCheck size={18} />}
                label="Status"
                value={org.admin.status}
              />

            </div>

          ) : (

            <p className="text-muted-foreground">
              Organization admin has not accepted the invitation yet.
            </p>

          )}

        </CardContent>

      </Card>

      {/* Subscription */}

      <Card>

        <CardHeader>

          <CardTitle>
            Subscription
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="flex items-center justify-between">

            <div>

              <p className="font-medium">
                {currentPlan?.name}
              </p>

              <p className="text-sm text-muted-foreground">
                  {currentPlan &&
                    new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: currentPlan.currency,
                    }).format(currentPlan.priceInMinorUnit / 100)}
                
              </p>

            </div>

            <div className="flex gap-3">

              <Select
                onValueChange={(value) =>
                  upgradeMutation.mutate(
                    value,
                  )
                }
              >

                <SelectTrigger className="w-64">

                  <SelectValue placeholder="Change Plan" />

                </SelectTrigger>

                <SelectContent>

                  {plans?.items
                    .filter(
                      (p) =>
                        p.id !==
                        org.currentPlanId,
                    )
                    .map((plan) => (

                      <SelectItem
                        key={plan.id}
                        value={plan.id}
                      >
                        {plan.name}
                      </SelectItem>

                    ))}

                </SelectContent>

              </Select>

              {upgradeMutation.isPending && (
                <Loader />
              )}

            </div>

          </div>

        </CardContent>

      </Card>

      {/* Contacts */}

      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <div>

            <CardTitle>
              Contact Persons
            </CardTitle>

            <CardDescription >
              Manage people associated with this organization.
            </CardDescription>

          </div>

          <AddContactPersonDialog
            organizationId={id}
          />

        </CardHeader>

        <CardContent>

          <ContactPersonList
            organizationId={id}
          />

        </CardContent>

      </Card>

      {/* Documents */}

      <Card>

        <CardHeader>

          <CardTitle>
            Documents
          </CardTitle>

          <CardDescription>
            Trade License, VAT,
            Passport etc.
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-6">

          <DocumentUpload
            organizationId={id}
          />

          <DocumentList
            organizationId={id}
          />

        </CardContent>

      </Card>

    </div>

  );

}

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

    <div className="flex gap-3">

      <div className="mt-1 text-muted-foreground">
        {icon}
      </div>

      <div>

        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <p className="font-medium">
          {value}
        </p>

      </div>

    </div>

  );

}