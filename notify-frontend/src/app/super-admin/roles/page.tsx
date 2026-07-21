'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { roleApi } from '@/lib/api/roles';
import { Role } from '@/lib/types/roles';
import { ApiClientError } from '@/lib/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateRoleDialog } from '@/components/roles/create-role-dialog';
import { EditRoleDialog } from '@/components/roles/edit-role-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Loader2, Pencil, Trash2 } from 'lucide-react';

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['roles', page],
    queryFn: () => roleApi.list(page),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted');
    },
    onError: (error: ApiClientError) => toast.error(error.message),
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No roles yet.
                  </TableCell>
                </TableRow>
              )}
              {data?.items.map((role) => (
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
                  <TableCell className="space-x-1 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditingRole(role)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {!role.isSystem && (
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
                        title="Delete this role?"
                        description={`"${role.name}" will be removed. Users assigned this role will lose its permissions.`}
                        onConfirm={() => deleteMutation.mutate(role.id)}
                        isPending={deleteMutation.isPending}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </div>
      )}

      <EditRoleDialog
        role={editingRole}
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
      />
    </div>
  );
}