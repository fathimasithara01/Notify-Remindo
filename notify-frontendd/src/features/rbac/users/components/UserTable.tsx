'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck, Pencil, KeyRound } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { USER_STATUS_META } from '../../shared/constants';
import type { User } from '../types/user.types';

import { useAuth } from '@/providers/AuthProvider';
import { PERMISSIONS } from '@/config/permissions';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentUserId?: string;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onManageRoles: (user: User) => void;
  onRequestPasswordReset: (user: User) => void;
  onBlock: (user: User) => void;
  onUnblock: (user: User) => void;
  pendingStatusUserId?: string | null;
}

export function UserTable({
  users,
  isLoading,
  currentUserId,
  onView,
  onEdit,
  onManageRoles,
  onRequestPasswordReset,
  onBlock,
  onUnblock,
  pendingStatusUserId,
}: UserTableProps) {
  const [confirmDeactivate, setConfirmDeactivate] = useState<User | null>(null);
  const { hasPermission } = useAuth();

  const canUpdate = hasPermission(PERMISSIONS.USER_UPDATE);
  const canAssignRole = hasPermission(PERMISSIONS.ROLE_ASSIGN);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-sm font-medium">No users found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filters, or invite a new user.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const statusMeta = USER_STATUS_META[user.status];
            const isSelf = user.id === currentUserId;
            const isActive = user.status === 'active';
            const isUpdatingStatus = pendingStatusUserId === user.id;

            const statusToggle = (
              <div className="flex items-center gap-2">
                {isUpdatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Switch
                    checked={isActive}
                    disabled={isSelf || !canUpdate}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onUnblock(user);
                      } else {
                        setConfirmDeactivate(user);
                      }
                    }}
                    aria-label={isActive ? 'Set inactive' : 'Set active'}
                  />
                )}
                <Badge variant={statusMeta.variant} className="font-normal">
                  {statusMeta.label}
                </Badge>
              </div>
            );

            return (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => onView(user)}
              >
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                  {isSelf && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      You
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.phone || '—'}
                </TableCell>
                <TableCell>
                  {user.role ? (
                    <Badge variant="outline">{user.role.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {isSelf ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex">{statusToggle}</div>
                      </TooltipTrigger>
                      <TooltipContent>You can&apos;t change your own status</TooltipContent>
                    </Tooltip>
                  ) : (
                    statusToggle
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    {canUpdate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit"
                        onClick={() => onEdit(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {canAssignRole && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Manage roles"
                        onClick={() => onManageRoles(user)}
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    )}
                    {isActive && canUpdate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Reset password"
                        onClick={() => onRequestPasswordReset(user)}
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!confirmDeactivate}
        onOpenChange={(open) => !open && setConfirmDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate user?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDeactivate && (
                <>
                  <strong>
                    {confirmDeactivate.firstName} {confirmDeactivate.lastName}
                  </strong>{' '}
                  will lose access immediately and won&apos;t be able to log in until
                  reactivated.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDeactivate) onBlock(confirmDeactivate);
                setConfirmDeactivate(null);
              }}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}