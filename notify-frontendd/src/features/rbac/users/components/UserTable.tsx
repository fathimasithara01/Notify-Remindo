'use client';

import { ShieldCheck, LogOut, Pencil, Trash2, KeyRound, Ban, CheckCircle } from 'lucide-react';
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

import { USER_STATUS_META } from '../../shared/constants';
import type { User } from '../types/user.types';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentUserId?: string;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onManageRoles: (user: User) => void;
  onRevokeSessions: (user: User) => void;
  onRequestPasswordReset: (user: User) => void;
  onBlock: (user: User) => void;
  onUnblock: (user: User) => void;
}

export function UserTable({
  users,
  isLoading,
  currentUserId,
  onView,
  onEdit,
  onDelete,
  onManageRoles,
  onRevokeSessions,
  onRequestPasswordReset,
  onBlock,
  onUnblock,
}: UserTableProps) {
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
            const isSuspended = user.status === 'suspended';

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
                <TableCell>
                  <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Edit"
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Manage roles"
                      onClick={() => onManageRoles(user)}
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                    {user.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Reset password"
                        onClick={() => onRequestPasswordReset(user)}
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>

                        // {canResetPassword && (
                        //     <Tooltip>
                        //       <TooltipTrigger asChild>
                        //         <Button
                        //           type="button"
                        //           variant="ghost"
                        //           size="icon"
                        //           aria-label={`Reset password for ${org.admin?.firstName ?? org.name}`}
                        //           disabled={isUpdating}
                        //           onClick={() => setResetPasswordOrg(org)}
                        //         >
                        //           <KeyRound className="h-4 w-4" />
                        //         </Button>
                        //       </TooltipTrigger>
                        //       <TooltipContent>
                        //         Reset password
                        //       </TooltipContent>
                        //     </Tooltip>
                        //   )}
                    )}
                    {isSuspended ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Unblock"
                        onClick={() => onUnblock(user)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Block"
                        disabled={isSelf}
                        onClick={() => onBlock(user)}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Revoke sessions"
                      disabled={isSelf}
                      onClick={() => onRevokeSessions(user)}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title={isSelf ? "Can't delete your own account" : 'Delete'}
                      disabled={isSelf}
                      onClick={() => onDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}