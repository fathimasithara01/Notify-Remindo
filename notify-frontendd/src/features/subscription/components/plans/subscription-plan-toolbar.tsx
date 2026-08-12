// components/plans/subscription-plan-toolbar.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionPlanStatus, Currency } from "../../types/subscription-plan.types";
import { useDebouncedValue } from "../../hooks/features/use-debounced-value";

interface SubscriptionPlanToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: SubscriptionPlanStatus | "all";
  onStatusChange: (value: SubscriptionPlanStatus | "all") => void;
  currency: Currency | "all";
  onCurrencyChange: (value: Currency | "all") => void;
  onCreate: () => void;
}

export function SubscriptionPlanToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  currency,
  onCurrencyChange,
  onCreate,
}: SubscriptionPlanToolbarProps) {
  const [value, setValue] = useState(search);
  const debounced = useDebouncedValue(value, 400);

  useEffect(() => {
    onSearchChange(debounced);
  }, [debounced]);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search plans..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-64"
        />
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as SubscriptionPlanStatus | "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={SubscriptionPlanStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={SubscriptionPlanStatus.INACTIVE}>Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={currency}
          onValueChange={(v) => onCurrencyChange(v as Currency | "all")}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="INR">INR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onCreate}>Add Plan</Button>
    </div>
  );
}