// components/plans/subscription-plan-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { SubscriptionPlan, SubscriptionPlanStatus } from "../../types/subscription-plan.types";

interface SubscriptionPlanColumnsProps {
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
  onBlock: (plan: SubscriptionPlan) => void;
  onUnblock: (plan: SubscriptionPlan) => void;
}

export function getSubscriptionPlanColumns({
  onEdit,
  onDelete,
  onBlock,
  onUnblock,
}: SubscriptionPlanColumnsProps): ColumnDef<SubscriptionPlan>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "amountValue",
      header: "Price",
      cell: ({ row }) => `${row.original.amountValue} ${row.original.currency}`,
    },
    {
      accessorKey: "userLimit",
      header: "User Limit",
    },
    {
      accessorKey: "storageLimit",
      header: "Storage (GB)",
    },
    {
      accessorKey: "featureIds",
      header: "Features",
      cell: ({ row }) => row.original.featureIds.length,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === SubscriptionPlanStatus.ACTIVE
              ? "default"
              : "secondary"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(plan)}>
                Edit
              </DropdownMenuItem>
              {plan.status === SubscriptionPlanStatus.ACTIVE ? (
                <DropdownMenuItem onClick={() => onBlock(plan)}>
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onUnblock(plan)}>
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(plan)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}