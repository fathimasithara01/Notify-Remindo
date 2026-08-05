'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Permission } from '../types/permission.types';

interface PermissionTableProps {
  permissions: Permission[];
  isLoading: boolean;
  onView: (permission: Permission) => void;
}

export function PermissionTable({ permissions, isLoading, onView }: PermissionTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-sm font-medium">No permissions found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or module filter.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Permission</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow
              key={permission.id}
              className="cursor-pointer"
              onClick={() => onView(permission)}
            >
              <TableCell className="font-medium">
                <code className="text-xs">{permission.name}</code>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{permission.module}</Badge>
              </TableCell>
              <TableCell className="max-w-md truncate text-muted-foreground">
                {permission.description || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}