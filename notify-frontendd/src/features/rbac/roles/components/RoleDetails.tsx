'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ROLE_STATUS_META } from '../../shared/constants';
import { useRolePermissions } from '../hooks/useRolePermissions';
import type { Role } from '../types/role.types';

interface RoleDetailsProps {
  role: Role;
}

export function RoleDetails({ role }: RoleDetailsProps) {
  const { data: permissions, isLoading } = useRolePermissions(role.id);
  const statusMeta = ROLE_STATUS_META[role.status];

  const grouped = (permissions ?? []).reduce<Record<string, typeof permissions>>(
    (acc, rp) => {
      const moduleName = rp.permission.module;
      acc[moduleName] = [...(acc[moduleName] ?? []), rp];
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{role.name}</h3>
        <code className="text-sm text-muted-foreground">{role.slug}</code>
      </div>

      {role.description && (
        <p className="text-sm text-muted-foreground">{role.description}</p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <dt className="text-muted-foreground">Status</dt>
        <dd>
          <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
        </dd>

        <dt className="text-muted-foreground">Type</dt>
        <dd>{role.isSystem ? 'System role' : 'Custom role'}</dd>

        <dt className="text-muted-foreground">Created</dt>
        <dd>{new Date(role.createdAt).toLocaleDateString()}</dd>
      </dl>

      <Separator />

      <div>
        <h4 className="mb-2 text-sm font-medium">Permissions</h4>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        ) : permissions && permissions.length > 0 ? (
          <div className="space-y-3">
            {Object.entries(grouped).map(([moduleName, perms]) => (
              <div key={moduleName}>
                <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                  {moduleName}
                </p>
                <div className="flex flex-wrap gap-2">
                  {perms?.map((rp) => (
                    <Badge key={rp.id} variant="outline">
                      {rp.permission.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No permissions assigned yet.</p>
        )}
      </div>
    </div>
  );
}