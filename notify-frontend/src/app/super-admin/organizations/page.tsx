'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationApi } from '@/lib/api/organizations';
import { Organization } from '@/lib/types/organization';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { ApiClientError } from '@/lib/api/client';
import { EditOrganizationDialog } from '@/components/organizations/edit-organization-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PaginationControls } from '@/components/shared/pagination-controls';

const ORGANIZATIONS_QUERY_KEY = ['organizations'];

export default function OrganizationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [...ORGANIZATIONS_QUERY_KEY, page],
    queryFn: () => organizationApi.list({ page, limit: 20 }),
  });

  const blockMutation = useMutation({
    mutationFn: (id: string) => organizationApi.block(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
      toast.success('Organization blocked');
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  const unblockMutation = useMutation({
    mutationFn: (id: string) => organizationApi.unblock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
      toast.success('Organization unblocked');
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => organizationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
      toast.success('Organization deleted');
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            Manage subscribing organizations (customers).
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/organizations/new">
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Link>
        </Button>
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
                <TableHead>Contact Email</TableHead>
                <TableHead>Contact Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No organizations yet.
                  </TableCell>
                </TableRow>
              )}
              {data?.items.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/super-admin/organizations/${org.id}`}
                      className="hover:underline"
                    >
                      {org.name}
                    </Link>
                  </TableCell>
                  <TableCell>{org.contactEmail}</TableCell>
                  <TableCell>{org.contactPhone}</TableCell>
                  <TableCell>
                    <Badge variant={org.status === 'active' ? 'default' : 'destructive'}>
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-1 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditingOrg(org)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {org.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => blockMutation.mutate(org.id)}
                        disabled={blockMutation.isPending}
                      >
                        Block
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unblockMutation.mutate(org.id)}
                        disabled={unblockMutation.isPending}
                      >
                        Unblock
                      </Button>
                    )}
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
                      title="Delete this organization?"
                      description={`"${org.name}" will be removed from active listings. This can be reversed by an administrator via the database if needed.`}
                      onConfirm={() => deleteMutation.mutate(org.id)}
                      isPending={deleteMutation.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </div>
      )}

      <EditOrganizationDialog
        organization={editingOrg}
        open={!!editingOrg}
        onOpenChange={(open) => !open && setEditingOrg(null)}
      />
    </div>
  );
}