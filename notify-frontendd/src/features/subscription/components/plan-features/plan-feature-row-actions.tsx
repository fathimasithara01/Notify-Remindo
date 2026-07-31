"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PlanFeatureWithDetails } from "../../types/plan-feature.types";

interface PlanFeatureRowActionsProps {
  planFeature: PlanFeatureWithDetails;
  onRemove: (
    planFeature: PlanFeatureWithDetails
  ) => void;
  disabled?: boolean;
}

export function PlanFeatureRowActions({
  planFeature,
  onRemove,
  disabled = false,
}: PlanFeatureRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-8 w-8"
        >
          <MoreHorizontal className="h-4 w-4" />

          <span className="sr-only">
            Open actions
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44"
      >
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() =>
            onRemove(planFeature)
          }
          disabled={disabled}
        >
          <Trash2 className="mr-2 h-4 w-4" />

          Remove Feature
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          {planFeature.feature?.key ??
            "Feature"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}