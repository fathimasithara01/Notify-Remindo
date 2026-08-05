"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  KeyRound,
  Send
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useOrganizations } from "../hooks/useOrganizations";

import {
  useBlockOrganization,
  useUnblockOrganization,
  useDeleteOrganization,
  useResendInvite,
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
import { ResetAdminPasswordDialog } from "./ResetAdminPasswordDialog";

export function OrganizationTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [resetPasswordOrg, setResetPasswordOrg] = useState<Organization | null>(null);
  const resendInviteMutation = useResendInvite();

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

                  const isResending =
                    resendInviteMutation.isPending &&
                    resendInviteMutation.variables === org.id;

                  const isUpdating =
                    isBlocking ||
                    isUnblocking ||
                    isDeleting ||
                    isResending;

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
                        {org.currentPlanName ?? "—"}
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


                      <TableCell>
                        <div className="flex justify-end gap-1">

                          {/* EDIT */}

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Edit ${org.name}`}
                                disabled={isUpdating}
                                onClick={() => setEditingOrg(org)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>

                          {/* RESEND INVITE */}

                          <ConfirmDialog
                            tooltip="Resend invitation"
                            trigger={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={isUpdating || !org.admin?.email}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            }
                            title="Resend invitation?"
                            description={`Resend invitation email to ${org.admin?.email ?? "this admin"}?`}
                            onConfirm={() => resendInviteMutation.mutate(org.id)}
                            isPending={isResending}
                          />

                          {/* RESET PASSWORD */}

                          {org.admin?.status === "active" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Reset password for ${org.admin.name}`}
                                  disabled={isUpdating}
                                  onClick={() => setResetPasswordOrg(org)}
                                >
                                  <KeyRound className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>
                                Reset password
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {/* BLOCK / UNBLOCK */}

                          {org.status === "active" ? (
                            <ConfirmDialog
                              tooltip="Block organization"
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  disabled={isUpdating}
                                  className="text-orange-600 hover:text-orange-600"
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              }
                              title="Block organization?"
                              description={`"${org.name}" will no longer be able to access the platform.`}
                              confirmLabel="Block"
                              onConfirm={() => blockMutation.mutate({ id: org.id })}
                              isPending={isBlocking}
                            />
                          ) : (
                            <ConfirmDialog
                              tooltip="Unblock organization"
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  disabled={isUpdating}
                                  className="text-green-600 hover:text-green-600"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              }
                              title="Unblock organization?"
                              description={`"${org.name}" will regain access to the platform.`}
                              confirmLabel="Unblock"
                              onConfirm={() => unblockMutation.mutate(org.id)}
                              isPending={isUnblocking}
                            />
                          )}

                          {/* DELETE */}

                          <ConfirmDialog
                            tooltip="Delete organization"
                            trigger={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                disabled={isUpdating}
                                aria-label={`Delete ${org.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            title="Delete organization?"
                            description={`"${org.name}" will be removed from active listings. This action cannot be easily undone.`}
                            confirmLabel="Delete"
                            onConfirm={() => deleteMutation.mutate(org.id)}
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

      <ResetAdminPasswordDialog
        organization={resetPasswordOrg}
        open={Boolean(resetPasswordOrg)}
        onOpenChange={(open) => {
          if (!open) {
            setResetPasswordOrg(null);
          }
        }}
      />

    </div>
  );
}