"use client";

import { Search, Plus, RotateCw } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeatureToolbarProps {

  search: string;

  onSearchChange: (value: string) => void;

  status: string;

  onStatusChange: (
    value: string
  ) => void;

  onRefresh: () => void;

  onCreate: () => void;

  isRefreshing?: boolean;

}

export function FeatureToolbar({

  search,

  onSearchChange,

  status,

  onStatusChange,

  onRefresh,

  onCreate,

  isRefreshing = false,

}: FeatureToolbarProps) {

  return (

    <div
      className="
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      "
    >

      {/* Search + Filter */}

      <div
        className="
          flex
          flex-1
          flex-col
          gap-3
          sm:flex-row
        "
      >

        <div className="relative flex-1">

          <Search
            className="
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input

            value={search}

            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }

            placeholder="Search features..."

            className="pl-10"

          />

        </div>

        <Select

          value={status}

          onValueChange={
            onStatusChange
          }

        >

          <SelectTrigger
            className="w-full sm:w-44"
          >

            <SelectValue />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              All Status
            </SelectItem>

            <SelectItem value="active">
              Active
            </SelectItem>

            <SelectItem value="inactive">
              Inactive
            </SelectItem>

          </SelectContent>

        </Select>

      </div>

      {/* Actions */}

      <div className="flex gap-2">

        <Button

          variant="outline"

          onClick={onRefresh}

          disabled={isRefreshing}

        >

          <RotateCw
            className={`mr-2 h-4 w-4 ${
              isRefreshing
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh

        </Button>

        <Button
          onClick={onCreate}
        >

          <Plus className="mr-2 h-4 w-4" />

          New Feature

        </Button>

      </div>

    </div>

  );

}