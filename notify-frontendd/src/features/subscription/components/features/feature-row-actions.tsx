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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Feature } from "../../types/feature.types";

interface FeatureRowActionsProps {
  feature: Feature;
  onEdit: (feature: Feature) => void;
  onDelete: (feature: Feature) => void;
}

export function FeatureRowActions({
  feature,
  onEdit,
  onDelete,
}: FeatureRowActionsProps) {

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
        className="w-44"
      >

        <DropdownMenuItem
          onClick={() => onEdit(feature)}
        >

          <Pencil className="mr-2 h-4 w-4" />

          Edit

        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(feature)}
        >

          <Trash2 className="mr-2 h-4 w-4" />

          Delete

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>

  );

}