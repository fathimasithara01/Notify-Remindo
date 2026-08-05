'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { USER_STATUS_META } from '../../shared/constants';
import { useUserRoles } from '../hooks/useUserRoles';
import type { User } from '../types/user.types';

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  const { data: roles, isLoading: rolesLoading } = useUserRoles(user.id);
  const statusMeta = USER_STATUS_META[user.status];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <dt className="text-muted-foreground">Status</dt>
        <dd>
          <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
        </dd>

        <dt className="text-muted-foreground">Phone</dt>
        <dd>{user.phone ?? '—'}</dd>

        <dt className="text-muted-foreground">Joined</dt>
        <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>

        <dt className="text-muted-foreground">Last updated</dt>
        <dd>{new Date(user.updatedAt).toLocaleDateString()}</dd>
      </dl>

      <Separator />

      <div>
        <h4 className="mb-2 text-sm font-medium">Assigned roles</h4>
        {rolesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        ) : roles && roles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {roles.map((userRole) => (
              <Badge key={userRole.id} variant="outline">
                {userRole.role.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No roles assigned yet.</p>
        )}
      </div>
    </div>
  );
}