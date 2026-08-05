"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
} from "lucide-react";

import { useOrganizations } from "../hooks/useOrganizations";

import {
  useBlockOrganization,
  useUnblockOrganization,
  useDeleteOrganization,
} from "../hooks/useOrganizationMutations";

import { Organization } from "../types/organization.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";

import { EditOrganizationDialog } from "./EditOrganizationDialog";

import { ROUTES } from "@/config/routes";
import { DEFAULT_PAGE_SIZE } from "@/constants/app";

export function OrganizationTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingOrg, setEditingOrg] =
    useState<Organization | null>(null);

  const {
    data,
    isLoading,
    isFetching,
  } = useOrganizations({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search,
  });

  const blockMutation = useBlockOrganization();
  const unblockMutation = useUnblockOrganization();
  const deleteMutation = useDeleteOrganization();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const organizations = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">

        <SearchInput
          placeholder="Search organizations..."
          onSearch={handleSearch}
        />

        {isFetching && (
          <span className="text-sm text-muted-foreground">
            Updating...
          </span>
        )}

      </div>

      {organizations.length === 0 ? (
        <EmptyState
          title={
            search
              ? "No organizations found"
              : "No organizations yet"
          }
        />
      ) : (

        <div className="overflow-hidden rounded-lg border bg-card">

          {/* Mobile horizontal scroll */}

          <div className="overflow-x-auto">

            <Table>

        
              <TableHeader>

                <TableRow>

                  <TableHead className="min-w-[220px] font-semibold">
                    Organization
                  </TableHead>

                  <TableHead className="min-w-[220px] font-semibold">
                    Admin Email
                  </TableHead>

                  <TableHead className="min-w-[150px] font-semibold">
                    Phone
                  </TableHead>

                  <TableHead className="min-w-[100px] font-semibold">
                    Plan Name
                  </TableHead>

                  
                  <TableHead className="min-w-[100px] font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="min-w-[180px] text-right font-semibold">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

            

              <TableBody>

                {organizations.map((org) => {

                  const isBlocking =
                    blockMutation.isPending &&
                    blockMutation.variables?.id === org.id;

                  const isUnblocking =
                    unblockMutation.isPending &&
                    unblockMutation.variables === org.id;

                  const isDeleting =
                    deleteMutation.isPending &&
                    deleteMutation.variables === org.id;

                  const isUpdating =
                    isBlocking ||
                    isUnblocking ||
                    isDeleting;

                  return (

                    <TableRow
                      key={org.id}
                      className="transition-colors hover:bg-muted/50"
                    >

                      <TableCell>

                        <Link
                          href={ROUTES.organizations.detail(
                            org.id
                          )}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {org.name}
                        </Link>

                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {org.admin?.email ?? "—"}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {org.admin?.phone ?? "—"}
                      </TableCell>

                       <TableCell className="text-muted-foreground">
                        {org?.currentPlanName ?? "—"}
                      </TableCell>

                      <TableCell>

                        <Badge
                          variant={
                            org.status === "active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {org.status}
                        </Badge>

                      </TableCell>

                      {/* ========================= */}
                      {/* ACTIONS */}
                      {/* ========================= */}

                      <TableCell>

                        <div className="flex justify-end gap-1">

                          {/* EDIT */}

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${org.name}`}
                            disabled={isUpdating}
                            onClick={() =>
                              setEditingOrg(org)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* BLOCK */}

                          {org.status === "active" ? (

                            <ConfirmDialog
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Block ${org.name}`}
                                  disabled={isUpdating}
                                  className="text-orange-600 hover:text-orange-600"
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              }

                              title="Block organization?"

                              description={
                                `"${org.name}" will no longer be able to access the platform.`
                              }

                              onConfirm={() =>
                                blockMutation.mutate({
                                  id: org.id,
                                })
                              }

                              isPending={isBlocking}
                            />

                          ) : (

                            <ConfirmDialog
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Unblock ${org.name}`}
                                  disabled={isUpdating}
                                  className="text-green-600 hover:text-green-600"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              }

                              title="Unblock organization?"

                              description={
                                `"${org.name}" will regain access to the platform.`
                              }

                              onConfirm={() =>
                                unblockMutation.mutate(
                                  org.id
                                )
                              }

                              isPending={isUnblocking}
                            />

                          )}

                          {/* DELETE */}

                          <ConfirmDialog
                            trigger={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Delete ${org.name}`}
                                disabled={isUpdating}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }

                            title="Delete organization?"

                            description={
                              `"${org.name}" will be removed from active listings. This action cannot be easily undone.`
                            }

                            onConfirm={() =>
                              deleteMutation.mutate(
                                org.id
                              )
                            }

                            isPending={isDeleting}
                          />

                        </div>

                      </TableCell>

                    </TableRow>

                  );
                })}

              </TableBody>

            </Table>

          </div>

          {/* ========================= */}
          {/* PAGINATION */}
          {/* ========================= */}

          {data?.meta && (
            <div className="border-t">

              <Pagination
                meta={data.meta}
                onPageChange={setPage}
              />

            </div>
          )}

        </div>
      )}

      {/* ========================= */}
      {/* EDIT DIALOG */}
      {/* ========================= */}

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