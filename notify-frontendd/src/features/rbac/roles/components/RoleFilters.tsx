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
import type { RoleFilters as RoleFiltersType } from '../types/role.types';

interface RoleFiltersProps {
  filters: RoleFiltersType;
  onChange: (filters: RoleFiltersType) => void;
}

export function RoleFilters({ filters, onChange }: RoleFiltersProps) {
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
          placeholder="Search by name"
          className="pl-8"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <Select
        value={filters.status ?? 'all'}
        onValueChange={(value) =>
          onChange({
            ...filters,
            status: value === 'all' ? undefined : (value as RoleFiltersType['status']),
            page: 1,
          })
        }
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}