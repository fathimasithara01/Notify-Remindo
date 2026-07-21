'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { permissionApi } from '@/lib/api/permissions';
import { Permission } from '@/lib/types/permission';
import { ApiClientError } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreatePermissionDialog } from '@/components/permissions/create-permission-dialog';
import { EditPermissionDialog } from '@/components/permissions/edit-permission-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Loader2, Pencil, Trash2 } from 'lucide-react';

export default function PermissionsPage() {
  const queryClient = useQueryClient();
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => permissionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permission deleted');
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  const permissions = data?.items ?? [];
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    (acc[p.module] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Permissions</h1>
          <p className="text-sm text-muted-foreground">
            The full catalog of permissions roles can be granted.
          </p>
        </div>
        <CreatePermissionDialog />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([module, perms]) => (
            <Card key={module}>
              <CardHeader>
                <CardTitle className="text-sm font-semibold capitalize">{module}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {perms.map((permission) => (
                  <div key={permission.id} className="flex items-start justify-between gap-2">
                    <div className="text-sm">
                      <p className="font-mono">{permission.name}</p>
                      {permission.description && (
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPermission(permission)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        }
                        title="Delete this permission?"
                        description={`"${permission.name}" will be removed from all roles that currently have it.`}
                        onConfirm={() => deleteMutation.mutate(permission.id)}
                        isPending={deleteMutation.isPending}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EditPermissionDialog
        permission={editingPermission}
        open={!!editingPermission}
        onOpenChange={(open) => !open && setEditingPermission(null)}
      />
    </div>
  );
}