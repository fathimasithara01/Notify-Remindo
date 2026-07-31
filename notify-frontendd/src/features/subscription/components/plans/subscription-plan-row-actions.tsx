"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SubscriptionPlan } from "../../types/subscription-plan.types";

interface SubscriptionPlanRowActionsProps {
  plan: SubscriptionPlan;
  isDeleting?: boolean;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlanRowActions({
  plan,
  isDeleting = false,
  onEdit,
  onDelete,
}: SubscriptionPlanRowActionsProps) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48"
      >

        <DropdownMenuItem
          onClick={() => onEdit(plan)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          disabled={isDeleting}
          onClick={() => onDelete(plan)}
        >
          <Trash2 className="mr-2 h-4 w-4" />

          {isDeleting
            ? "Deleting..."
            : "Delete"}
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}