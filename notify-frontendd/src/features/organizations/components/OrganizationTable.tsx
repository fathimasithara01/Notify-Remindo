'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useOrganizations } from '../hooks/useOrganizations';
import {
    useBlockOrganization,
    useUnblockOrganization,
    useDeleteOrganization,
} from '../hooks/useOrganizationMutations';
import { Organization } from '../types/organization.types';
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
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { EditOrganizationDialog } from './EditOrganizationDialog';
import { Pencil, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { DEFAULT_PAGE_SIZE } from '@/constants/app';

export function OrganizationTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const { data, isLoading } = useOrganizations({ page, limit: DEFAULT_PAGE_SIZE, search });

    const blockMutation = useBlockOrganization();
    const unblockMutation = useUnblockOrganization();
    const deleteMutation = useDeleteOrganization();

    return (
        <div className="space-y-4">
            <SearchInput
                placeholder="Search organizations…"
                onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
            />

            {isLoading ? (
                <LoadingState />
            ) : data?.items.length === 0 ? (
                <EmptyState title="No organizations found" />
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
                            {data?.items.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell className="font-medium">
                                        <Link href={ROUTES.organizations.detail(org.id)} className="hover:underline">
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
                                                onClick={() => blockMutation.mutate({ id: org.id })}
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
                                            description={`"${org.name}" will be removed from active listings.`}
                                            onConfirm={() => deleteMutation.mutate(org.id)}
                                            isPending={deleteMutation.isPending}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {data && <Pagination meta={data.meta} onPageChange={setPage} />}
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