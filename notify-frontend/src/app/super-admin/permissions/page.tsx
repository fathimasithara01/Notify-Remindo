'use client';

import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '@/lib/api/permissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePermissionDialog } from '@/components/permissions/create-permission-dialog';
import { Loader2 } from 'lucide-react';

export default function PermissionsPage() {
  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionApi.list(),
  });

  const grouped = (permissions ?? []).reduce<Record<string, typeof permissions>>((acc, p) => {
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
              <CardContent className="space-y-2">
                {perms?.map((permission) => (
                  <div key={permission.id} className="text-sm">
                    <p className="font-mono">{permission.name}</p>
                    {permission.description && (
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}