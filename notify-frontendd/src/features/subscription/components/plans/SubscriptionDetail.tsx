"use client";

import { SubscriptionPlan } from "../../types/subscription-plan.types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface SubscriptionDetailProps {
  plan: SubscriptionPlan;
}

export function SubscriptionDetail({
  plan,
}: SubscriptionDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="px-0"
            >
              <Link href="/super-admin/subscription-plans">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Subscription Plans
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {plan.name}
              </h1>

              <p className="mt-2 text-muted-foreground">
                {plan.description ||
                  "No description available."}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>

              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            General Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 md:grid-cols-2">
            <DetailItem label="Status">
              <StatusBadge status={plan.status} />
            </DetailItem>

            <DetailItem label="Price">
              {formatCurrency(
                plan.priceInMinorUnit,
                plan.currency
              )}
            </DetailItem>

            <DetailItem label="Currency">
              {plan.currency}
            </DetailItem>

            <DetailItem label="Billing Interval">
              {capitalize(plan.billingInterval)}
            </DetailItem>

            <DetailItem label="Trial Days">
              {plan.trialDays ?? 0} Days
            </DetailItem>
          </dl>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-7 text-muted-foreground">
            {plan.description ||
              "No description available."}
          </p>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 md:grid-cols-2">
            <DetailItem label="Plan ID">
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {plan.id}
              </code>
            </DetailItem>

            <DetailItem label="Created At">
              {formatDate(plan.createdAt)}
            </DetailItem>

            <DetailItem label="Updated At">
              {formatDate(plan.updatedAt)}
            </DetailItem>

            <DetailItem label="Deleted">
              {plan.deletedAt ? "Yes" : "No"}
            </DetailItem>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  children: React.ReactNode;
}

function DetailItem({
  label,
  children,
}: DetailItemProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-muted-foreground">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium">
        {children}
      </dd>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: SubscriptionPlan["status"];
}) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-600 hover:bg-green-600">
          Active
        </Badge>
      );

    case "inactive":
      return (
        <Badge variant="destructive">
          Inactive
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          Draft
        </Badge>
      );
  }
}

function formatCurrency(
  amount: number,
  currency: string
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString();
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}