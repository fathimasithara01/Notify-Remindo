'use client';

import { Badge } from '@/components/ui/badge';
import type { Permission } from '../types/permission.types';

interface PermissionDetailsProps {
  permission: Permission;
}

export function PermissionDetails({ permission }: PermissionDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          <code>{permission.name}</code>
        </h3>
        <div className="mt-2">
          <Badge variant="outline">{permission.module}</Badge>
        </div>
      </div>

      {permission.description && (
        <p className="text-sm text-muted-foreground">{permission.description}</p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <dt className="text-muted-foreground">Created</dt>
        <dd>{new Date(permission.createdAt).toLocaleDateString()}</dd>

        <dt className="text-muted-foreground">Last updated</dt>
        <dd>{new Date(permission.updatedAt).toLocaleDateString()}</dd>
      </dl>
    </div>
  );
}