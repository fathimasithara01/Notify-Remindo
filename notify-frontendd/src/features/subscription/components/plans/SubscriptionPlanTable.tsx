"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";


import {
  Pencil,
  Trash2,
  Ban,
  Eye
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SubscriptionPlan, SubscriptionPlanStatus } from "../../types/subscription-plan.types";
import { SubscriptionPlanStatusBadge } from "./SubscriptionPlanStatusBadge";

import { useAuth } from "@/providers/AuthProvider";
import { PERMISSIONS } from "@/config/permissions";

interface SubscriptionPlanTableProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  actionPendingId: string | null;
  onView: (plan: SubscriptionPlan) => void;
  onEdit: (plan: SubscriptionPlan) => void;
  onToggleStatus: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlanTable({
  plans,
  isLoading,
  actionPendingId,
  onView,
  onEdit,
  onToggleStatus,
}: SubscriptionPlanTableProps) {
  const { hasPermission } = useAuth();
  const canUpdate = hasPermission(PERMISSIONS.PLAN_UPDATE);

  if (isLoading && plans.length === 0) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading plans...</div>;
  }

  if (!isLoading && plans.length === 0) {
    return <div className="py-16 text-center text-sm text-muted-foreground">No plans found.</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="font-semibold">User Limit</TableHead>
            <TableHead className="font-semibold">Storage (GB)</TableHead>
            <TableHead className="font-semibold">Features</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => {
            const isPending = actionPendingId === plan.id;
            const isActive = plan.status === SubscriptionPlanStatus.ACTIVE;

            return (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.title}</TableCell>
                <TableCell>
                  {plan.amountValue} {plan.currency}
                </TableCell>
                <TableCell>{plan.userLimit}</TableCell>
                <TableCell>{plan.storageLimit}</TableCell>
                <TableCell>{plan.featureIds.length}</TableCell>
                <TableCell>
                  <SubscriptionPlanStatusBadge status={plan.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => onView(plan)}
                    >
                      <Eye className="h-4 w-4" />

                    </Button>
                    {canUpdate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => onEdit(plan)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {canUpdate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => onToggleStatus(plan)}
                      >
                        {isPending ? "..." : isActive ? "Block" : "Unblock"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}