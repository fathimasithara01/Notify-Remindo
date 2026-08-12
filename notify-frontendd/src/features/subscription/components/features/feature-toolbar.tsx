// components/features/feature-toolbar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeatureStatus } from "../../types/feature.types";
import { useDebouncedValue } from "../../hooks/features/use-debounced-value";
import { useEffect, useState } from "react";

interface FeatureToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: FeatureStatus | "all";
  onStatusChange: (value: FeatureStatus | "all") => void;
  onCreate: () => void;
}

export function FeatureToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreate,
}: FeatureToolbarProps) {
  const [value, setValue] = useState(search);
  const debounced = useDebouncedValue(value, 400);

  useEffect(() => {
    onSearchChange(debounced);
  }, [debounced]);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search features..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-64"
        />
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as FeatureStatus | "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={FeatureStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={FeatureStatus.INACTIVE}>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onCreate}>Add Feature</Button>
    </div>
  );
}