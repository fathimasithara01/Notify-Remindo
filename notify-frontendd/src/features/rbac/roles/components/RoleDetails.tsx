'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ROLE_STATUS_META } from '../../shared/constants';
import { ALL_PERMISSIONS } from '../../shared/constants';
import type { Role } from '../types/role.types';

interface RoleDetailsProps {
  role: Role;
}

export function RoleDetails({ role }: RoleDetailsProps) {
  const statusMeta = ROLE_STATUS_META[role.status];
  const permissionSet = new Set(role.permissionIds);
  const assigned = ALL_PERMISSIONS.filter((p) => permissionSet.has(p.id));

  const grouped = assigned.reduce<Record<string, typeof assigned>>((acc, p) => {
    acc[p.module] = [...(acc[p.module] ?? []), p];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{role.name}</h3>
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
        {assigned.length > 0 ? (
          <div className="space-y-3">
            {Object.entries(grouped).map(([moduleName, perms]) => (
              <div key={moduleName}>
                <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                  {moduleName}
                </p>
                <div className="flex flex-wrap gap-2">
                  {perms.map((p) => (
                    <Badge key={p.id} variant="outline">
                      {p.label}
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