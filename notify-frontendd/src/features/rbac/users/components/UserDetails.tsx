'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { USER_STATUS_META } from '../../shared/constants';
import { useRole } from '../../roles/hooks/useRole';
import type { User } from '../types/user.types';

interface UserDetailsProps {
    user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
    const { data: role, isLoading: roleLoading } = useRole(user.roleId);
    const statusMeta = USER_STATUS_META[user.status];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h3>
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
                <h4 className="mb-2 text-sm font-medium">Role</h4>
                {roleLoading ? (
                    <Skeleton className="h-6 w-24" />
                ) : role ? (
                    <Badge variant="outline">{role.name}</Badge>
                ) : (
                    <p className="text-sm text-muted-foreground">No role assigned.</p>
                )}
            </div>
        </div>
    );
}