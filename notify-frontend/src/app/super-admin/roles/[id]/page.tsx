'use client';

import { use, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { roleApi } from '@/lib/api/roles';
import { permissionApi } from '@/lib/api/permissions';
import { ApiClientError } from '@/lib/api/client';
import { Permission } from '@/lib/types/permission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const { data: role, isLoading: roleLoading } = useQuery({
        queryKey: ['roles', id],
        queryFn: () => roleApi.getOne(id),
    });

    const { data: permissionsResponse, isLoading: permissionsLoading } = useQuery({
        queryKey: ['permissions'],
        queryFn: () => permissionApi.list(),
    });

    const permissions = permissionsResponse?.items ?? [];  

    useEffect(() => {
        if (role && permissions.length > 0) {
            const ids = permissions
                .filter((p) => role.permissions.includes(p.name))
                .map((p) => p.id);
            setSelected(new Set(ids));
        }
    }, [role, permissions]);

    const assignMutation = useMutation({
        mutationFn: (permissionIds: string[]) => roleApi.assignPermissions(id, permissionIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles', id] });
            toast.success('Permissions updated');
        },
        onError: (error: ApiClientError) => toast.error(error.message),
    });

    const toggle = (permissionId: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(permissionId)) next.delete(permissionId);
            else next.add(permissionId);
            return next;
        });
    };

    if (roleLoading || permissionsLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!role) {
        return <p className="text-muted-foreground">Role not found.</p>;
    }

    const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
        (acc[p.module] ??= []).push(p);
        return acc;
    }, {});

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{role.name}</h1>
                    <p className="font-mono text-sm text-muted-foreground">{role.slug}</p>
                </div>
                {role.isSystem && <Badge variant="secondary">Built-in role</Badge>}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Object.entries(grouped).map(([module, perms]) => (
                        <div key={module}>
                            <h3 className="mb-2 text-sm font-semibold capitalize text-muted-foreground">
                                {module}
                            </h3>
                            <div className="space-y-2">
                                {perms?.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Checkbox
                                            checked={selected.has(permission.id)}
                                            onCheckedChange={() => toggle(permission.id)}
                                        />
                                        <span>{permission.name}</span>
                                        {permission.description && (
                                            <span className="text-muted-foreground">— {permission.description}</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={() => assignMutation.mutate(Array.from(selected))}
                            disabled={assignMutation.isPending}
                        >
                            {assignMutation.isPending ? 'Saving…' : 'Save Permissions'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}