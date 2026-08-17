"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SubscriptionPlan, SubscriptionPlanStatus } from "../../types/subscription-plan.types";
import { SubscriptionPlanStatusBadge } from "./SubscriptionPlanStatusBadge";

import { useAuth } from "@/providers/AuthProvider";
import { PERMISSIONS } from "@/config/permissions";

interface SubscriptionPlanTableProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  actionPendingId: string | null;
  onEdit: (plan: SubscriptionPlan) => void;
  onToggleStatus: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlanTable({
  plans,
  isLoading,
  actionPendingId,
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
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>User Limit</TableHead>
            <TableHead>Storage (GB)</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                    {canUpdate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => onEdit(plan)}
                      >
                        Edit
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