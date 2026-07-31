"use client";

import { Search, RotateCw, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SubscriptionPlanFilters {
  search: string;
  status: "all" | "draft" | "active" | "inactive";
}

interface SubscriptionPlanToolbarProps {
  filters: SubscriptionPlanFilters;

  total: number;

  isRefreshing?: boolean;

  onFiltersChange: (
    filters: SubscriptionPlanFilters
  ) => void;

  onRefresh: () => void;

  onCreate: () => void;
}

export function SubscriptionPlanToolbar({
  filters,
  total,
  isRefreshing = false,
  onFiltersChange,
  onRefresh,
  onCreate,
}: SubscriptionPlanToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Subscription Plans
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage subscription plans available for organizations.
          </p>

        </div>

        <Button
          onClick={onCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>

      </div>

      {/* Filters */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div className="flex flex-1 gap-3">

          {/* Search */}

          <div className="relative w-full max-w-sm">

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
              placeholder="Search plans..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  search: e.target.value,
                })
              }
              className="pl-9"
            />

          </div>

          {/* Status */}

          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                status: value as SubscriptionPlanFilters["status"],
              })
            }
          >

            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                All Status
              </SelectItem>

              <SelectItem value="active">
                Active
              </SelectItem>

              <SelectItem value="draft">
                Draft
              </SelectItem>

              <SelectItem value="inactive">
                Inactive
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

        <div className="flex items-center gap-3">

          <span className="text-sm text-muted-foreground">
            {total} Plans
          </span>

          <Button
            variant="outline"
            size="icon"
            disabled={isRefreshing}
            onClick={onRefresh}
          >
            <RotateCw
              className={`h-4 w-4 ${
                isRefreshing
                  ? "animate-spin"
                  : ""
              }`}
            />
          </Button>

        </div>

      </div>

    </div>
  );
}