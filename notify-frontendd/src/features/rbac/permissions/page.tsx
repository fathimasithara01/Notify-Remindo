'use client';

import { useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { PermissionTable } from './components/PermissionTable';
import { PermissionFilters } from './components/PermissionFilters';
import { PermissionDetails } from './components/PermissionDetails';

import { usePermissions } from './hooks/usePermissions';
import { DEFAULT_PAGE_SIZE } from '../shared/constants';

import type { Permission, PermissionFilters as PermissionFiltersType } from './types/permission.types';

export default function PermissionsPage() {
  const [filters, setFilters] = useState<PermissionFiltersType>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [selected, setSelected] = useState<Permission | null>(null);

  const { data, isLoading } = usePermissions(filters);

  const availableModules = useMemo(
    () => Array.from(new Set((data?.items ?? []).map((p) => p.module))).sort(),
    [data?.items]
  );

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Permissions</h1>
        <p className="text-sm text-muted-foreground">
          System-defined permissions, grouped by module. Attach these to roles
          from the Roles page.
        </p>
      </div>

      <PermissionFilters
        filters={filters}
        onChange={setFilters}
        availableModules={availableModules}
      />

      <PermissionTable
        permissions={data?.items ?? []}
        isLoading={isLoading}
        onView={setSelected}
      />

      {data && data.total > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))
                }
                className={filters.page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm text-muted-foreground">
                Page {filters.page ?? 1} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    page: Math.min(totalPages, (f.page ?? 1) + 1),
                  }))
                }
                className={
                  (filters.page ?? 1) >= totalPages ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Sheet open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Permission details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selected && <PermissionDetails permission={selected} />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}