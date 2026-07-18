'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationApi } from '@/lib/api/organizations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus } from 'lucide-react';
import { ApiClientError } from '@/lib/api/client';

const ORGANIZATIONS_QUERY_KEY = ['organizations'];

export default function OrganizationsPage() {
    const queryClient = useQueryClient();

    const { data: organizations, isLoading } = useQuery({
        queryKey: ORGANIZATIONS_QUERY_KEY,
        queryFn: () => organizationApi.list(),
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
                        <Plus className="h-4 w-4" />
                        <span>New Organization</span>
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
                            {organizations?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                        No organizations yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {organizations?.map((org) => (
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
                                    <TableCell className="text-right">
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