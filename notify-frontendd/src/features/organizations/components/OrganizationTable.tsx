'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  useOrganizations,
} from '../hooks/useOrganizations';

import {
  useBlockOrganization,
  useUnblockOrganization,
  useDeleteOrganization,
} from '../hooks/useOrganizationMutations';

import {
  Organization,
} from '../types/organization.types';

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

import {
  Pencil,
  Trash2,
} from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { DEFAULT_PAGE_SIZE } from '@/constants/app';


export function OrganizationTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const { data, isLoading, isFetching, } = useOrganizations({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search,
  });

  const blockMutation = useBlockOrganization();
  const unblockMutation = useUnblockOrganization();
  const deleteMutation = useDeleteOrganization();

  const handleSearch = (value: string) => { setSearch(value); setPage(1) };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">

      {/* Search */}
      <SearchInput
        placeholder="Search organizations..."
        onSearch={handleSearch}
      />

      {/* Loading next page / filter */}
      {isFetching && !isLoading && (
        <div className="text-sm text-muted-foreground">
          Updating organizations...
        </div>
      )}

      {/* Empty State */}
      {!data?.items?.length ? (
        <EmptyState
          title="No organizations found"
        />
      ) : (

        <div className="rounded-md border bg-card">

          <Table>

            <TableHeader>
              <TableRow>

                <TableHead className="font-semibold">
                  Organization Name
                </TableHead>

                <TableHead className="font-semibold">
                  Admin Email
                </TableHead>

                <TableHead className="font-semibold">
                  Admin Phone
                </TableHead>

                <TableHead className="font-semibold">
                  Status
                </TableHead>

                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>

              </TableRow>
            </TableHeader>


            <TableBody>

              {data.items.map(
                (org) => {

                  const isBlocking =
                    blockMutation.isPending &&
                    blockMutation.variables?.id === org.id;

                  const isUnblocking =
                    unblockMutation.isPending &&
                    unblockMutation.variables === org.id;

                  const isDeleting =
                    deleteMutation.isPending &&
                    deleteMutation.variables === org.id;


                  return (

                    <TableRow key={org.id}>

                      {/* Organization Name */}
                      <TableCell className="font-medium">

                        <Link
                          href={ROUTES.organizations.detail(org.id)}
                          className="hover:underline"
                        >
                          {org.name}
                        </Link>

                      </TableCell>


                      {/* Organization Admin Email */}
                      <TableCell>
                        {org.admin?.email ?? '—'}
                      </TableCell>


                      {/* Organization Admin Phone */}
                      <TableCell>
                        {org.admin?.phone ?? '—'}
                      </TableCell>


                      {/* Organization Status */}
                      <TableCell>

                        <Badge
                          variant={
                            org.status === 'active'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {org.status}
                        </Badge>

                      </TableCell>


                      {/* Actions */}
                      <TableCell className="text-right">

                        <div className="flex justify-end gap-1">

                          {/* Edit */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEditingOrg(org)
                            }
                            disabled={
                              isDeleting
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>


                          {/* Block / Unblock */}
                          {org.status === 'active' ? (

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                blockMutation.mutate({
                                  id: org.id,
                                })
                              }
                              disabled={
                                isBlocking ||
                                isDeleting
                              }
                            >
                              {isBlocking
                                ? 'Blocking...'
                                : 'Block'}
                            </Button>

                          ) : (

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                unblockMutation.mutate(
                                  org.id
                                )
                              }
                              disabled={
                                isUnblocking ||
                                isDeleting
                              }
                            >
                              {isUnblocking
                                ? 'Unblocking...'
                                : 'Unblock'}
                            </Button>

                          )}


                          {/* Delete */}
                          <ConfirmDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                disabled={
                                  isDeleting
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }

                            title="Delete this organization?"

                            description={
                              `"${org.name}" will be removed from active listings.`
                            }

                            onConfirm={() =>
                              deleteMutation.mutate(
                                org.id
                              )
                            }

                            isPending={
                              isDeleting
                            }
                          />

                        </div>

                      </TableCell>

                    </TableRow>

                  );
                }
              )}

            </TableBody>

          </Table>


          {/* Pagination */}
          {data.meta && (
            <Pagination
              meta={data.meta}
              onPageChange={setPage}
            />
          )}

        </div>
      )}


      {/* Edit Organization */}
      <EditOrganizationDialog
        organization={editingOrg}
        open={Boolean(editingOrg)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingOrg(null);
          }
        }}
      />

    </div>
  );
}