'use client';

import { MoreHorizontal, ShieldCheck, LogOut, Pencil, Trash2, Mail, KeyRound } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  onResendInvite: (user: User) => void;
  onRequestPasswordReset: (user: User) => void;
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
  onResendInvite ,
  onRequestPasswordReset,
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
            <TableHead>Status</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const statusMeta = USER_STATUS_META[user.status];
            const isSelf = user.id === currentUserId;
            return (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => onView(user)}
              >
                <TableCell className="font-medium">
                  {user.name}
                  {isSelf && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      You
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.phone ?? '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageRoles(user)}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Manage roles
                      </DropdownMenuItem>

                      {user.status === 'invited' && (
                        <DropdownMenuItem onClick={() => onResendInvite(user)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Resend invite
                        </DropdownMenuItem>
                      )}

                      {user.status === 'active' && (
                        <DropdownMenuItem onClick={() => onRequestPasswordReset(user)}>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Reset password
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem onClick={() => onRevokeSessions(user)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Revoke sessions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(user)}
                        disabled={isSelf}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isSelf ? "Can't delete your own account" : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}