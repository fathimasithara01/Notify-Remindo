"use client";

import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Role } from "../types/role.types";

import { useAuth } from "@/providers/AuthProvider";
import { PERMISSIONS } from "@/config/permissions";

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  actionPendingId: string | null;
  onEdit: (role: Role) => void;
  onToggleStatus: (role: Role) => void;
}

export function RoleTable({
  roles,
  isLoading,
  actionPendingId,
  onEdit,
  onToggleStatus,
}: RoleTableProps) {
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const { hasPermission } = useAuth();

  const canUpdate = hasPermission(PERMISSIONS.ROLE_UPDATE);
  const canView = hasPermission(PERMISSIONS.ROLE_VIEW);

  if (isLoading && roles.length === 0) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading roles...</div>;
  }

  if (!isLoading && roles.length === 0) {
    return <div className="py-16 text-center text-sm text-muted-foreground">No roles found.</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => {
            const isPending = actionPendingId === role.id;
            const isActive = role.status === "active";
            const canToggleStatus = canUpdate && !role.isSystem;

            return (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell className="max-w-xs">
                  <span className="line-clamp-1 text-muted-foreground">
                    {role.description ?? "—"}
                  </span>
                </TableCell>
                <TableCell>{role.permissionIds.length}</TableCell>
                <TableCell>
                  <Badge variant={role.isSystem ? "outline" : "secondary"}>
                    {role.isSystem ? "System" : "Custom"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {role.createdByUser?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={canToggleStatus ? "cursor-pointer select-none gap-1" : ""}
                    onClick={() => canToggleStatus && !isPending && onToggleStatus(role)}
                  >
                    {isPending ? "..." : isActive ? "Active" : "Inactive"}
                    {canToggleStatus && !isPending && <ChevronDown className="h-3 w-3" />}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canView && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="View"
                        onClick={() => setViewingRole(role)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {canUpdate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending || role.isSystem}
                        onClick={() => onEdit(role)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={!!viewingRole} onOpenChange={(open) => !open && setViewingRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingRole?.name}</DialogTitle>
          </DialogHeader>
          {viewingRole && (
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Description</div>
                <div>{viewingRole.description || "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Permissions</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {viewingRole.permissionIds.length > 0 ? (
                    viewingRole.permissionIds.map((p) => (
                      <Badge key={p} variant="outline">{p}</Badge>
                    ))
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div>{viewingRole.isSystem ? "System" : "Custom"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div>{viewingRole.status === "active" ? "Active" : "Inactive"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Created By</div>
                  <div>{viewingRole.createdByUser?.name ?? "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div>{new Date(viewingRole.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}