'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { roleApi } from '@/lib/api/roles';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateRoleDialog } from '@/components/roles/create-role-dialog';
import { Loader2 } from 'lucide-react';

export default function RolesPage() {
  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: roleApi.list,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Roles</h1>
          <p className="text-sm text-muted-foreground">
            Manage admin roles and their permissions.
          </p>
        </div>
        <CreateRoleDialog />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No roles yet.
                  </TableCell>
                </TableRow>
              )}
              {roles?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <Link href={`/super-admin/roles/${role.id}`} className="hover:underline">
                      {role.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {role.slug}
                  </TableCell>
                  <TableCell>
                    {role.isSystem ? (
                      <Badge variant="secondary">Built-in</Badge>
                    ) : (
                      <Badge variant="outline">Custom</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.status === 'active' ? 'default' : 'destructive'}>
                      {role.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}