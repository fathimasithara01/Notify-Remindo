'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PermissionFilters as PermissionFiltersType } from '../types/permission.types';

interface PermissionFiltersProps {
  filters: PermissionFiltersType;
  onChange: (filters: PermissionFiltersType) => void;
  /** Distinct module names for the dropdown — pass from currently loaded data or a static list. */
  availableModules: string[];
}

export function PermissionFilters({
  filters,
  onChange,
  availableModules,
}: PermissionFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== (filters.search ?? '')) {
        onChange({ ...filters, search: searchInput || undefined, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search permissions"
          className="pl-8"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <Select
        value={filters.module ?? 'all'}
        onValueChange={(value) =>
          onChange({ ...filters, module: value === 'all' ? undefined : value, page: 1 })
        }
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Module" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All modules</SelectItem>
          {availableModules.map((module) => (
            <SelectItem key={module} value={module}>
              {module}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}